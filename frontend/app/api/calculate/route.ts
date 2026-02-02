import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { activity, partners, origin, entity, license } = body;

        // Load Rules from backend/data
        const jsonDirectory = path.join(process.cwd(), '../backend/data');
        const rulesFile = await fs.readFile(jsonDirectory + '/pricing-rules.json', 'utf8');
        const licensesFile = await fs.readFile(jsonDirectory + '/license-categories.json', 'utf8');

        const rules = JSON.parse(rulesFile);
        const licenseCategories = JSON.parse(licensesFile);

        // 1. Base Fees (Government etc)
        let total = 0;
        const breakdown = [];
        const baseFeesSum = Object.values(rules.baseFees).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
        total += baseFeesSum;
        breakdown.push({ label: "Government Registration Fees", amount: baseFeesSum });

        // 2. License Fee (Dynamic from License Category)
        let licenseFee = 0;
        const selectedLicenseCategory = licenseCategories.find((l: any) => l.id === license);

        if (selectedLicenseCategory) {
            licenseFee = selectedLicenseCategory.baseFee;
            breakdown.push({ label: `${selectedLicenseCategory.valueEn} Fee`, amount: licenseFee });
        } else {
            // Fallback if ID not found or legacy type passed
            licenseFee = rules.licenseTypes["Commercial"] || 6000;
            breakdown.push({ label: "Standard License Fee", amount: licenseFee });
        }
        total += licenseFee;

        // 3. Structure Costs
        // Map legal entity ID to rules keys if necessary, but we try to match ID
        const structure = rules.structureAddons[entity] || rules.structureAddons['llc'] || {}; // Default to LLC structure costs if unknown
        if (structure.moaFee) {
            total += structure.moaFee;
            breakdown.push({ label: "MOA Notarization", amount: structure.moaFee });
        }
        if (structure.foreignOwnerAgentFee && entity === 'sole-establishment') {
            // Check origin logic again here if needed, or assume passed param is correct
            if (origin !== 'local' && origin !== 'regional') {
                total += structure.foreignOwnerAgentFee;
                breakdown.push({ label: "Local Service Agent Fee", amount: structure.foreignOwnerAgentFee });
            }
        }

        // 4. Visa Costs
        const partnerCount = parseInt(partners) || 1;
        const visaUnitCost = rules.visa.costPerPerson + rules.visa.medicalIdPerPerson;
        const totalVisaCost = partnerCount * visaUnitCost;
        total += totalVisaCost;
        breakdown.push({ label: `Investor Visas (${partnerCount})`, amount: totalVisaCost });

        // 5. Office Costs (Assumption: Flexi Desk for basics unless License Category implies otherwise)
        // e.g. DED Trader is Home Based (0 office cost maybe?), Instant License might differ.
        // For simplified logic: If license is "ded-trader" or "intelaq", office cost might be 0 or small.
        // Let's rely on rules.office.flexiDesk for now unless we add specific office logic.
        let officeCost = rules.office.flexiDesk;

        // Custom Office Logic based on License
        if (selectedLicenseCategory?.location?.toLowerCase().includes('home based')) {
            officeCost = 0; // No physical office needed
        }

        if (officeCost > 0) {
            total += officeCost;
            breakdown.push({ label: "Office Lease (Flexi-Desk)", amount: officeCost });
        }

        // 6. Market Fees (Innovation/Market fees usually % of Rent + License)
        const marketFee = (licenseFee + (officeCost > 0 ? officeCost : 0)) * rules.marketFeeRate;
        total += marketFee;
        breakdown.push({ label: "Market Fees (approx 2.5%)", amount: Math.round(marketFee) });

        return NextResponse.json({
            total: Math.round(total),
            currency: "AED",
            breakdown
        });

    } catch (error) {
        console.error("Calculation error:", error);
        return NextResponse.json({ error: 'Failed to calculate cost' }, { status: 500 });
    }
}
