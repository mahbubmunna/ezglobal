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
        const activitiesFile = await fs.readFile(jsonDirectory + '/activities.json', 'utf8');

        const rules = JSON.parse(rulesFile);
        const activities = JSON.parse(activitiesFile);

        // 1. Base Fees
        let total = 0;
        const breakdown = [];
        const baseFeesSum = Object.values(rules.baseFees).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
        total += baseFeesSum;
        breakdown.push({ label: "Government Registration Fees", amount: baseFeesSum });

        // 2. License Fee
        // Find activity license type
        const selectedActivity = activities.find((a: any) => a.valueEn === activity || a.code === activity);
        const licenseType = selectedActivity?.licenseType || "Commercial"; // Default
        const licenseFee = rules.licenseTypes[licenseType] || rules.licenseTypes["Commercial"];
        total += licenseFee;
        breakdown.push({ label: `${licenseType} License Fee`, amount: licenseFee });

        // 3. Structure Costs
        const structure = rules.structureAddons[entity] || {};
        if (structure.moaFee) {
            total += structure.moaFee;
            breakdown.push({ label: "MOA Notarization", amount: structure.moaFee });
        }
        if (origin !== 'local' && origin !== 'regional' && entity === 'sole-establishment') {
            // Foreigner in Sole Est often needs LSA
            if (structure.foreignOwnerAgentFee) {
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

        // 5. Office Costs (Assumption: Flexi Desk for basics)
        const officeCost = rules.office.flexiDesk;
        total += officeCost;
        breakdown.push({ label: "Office Lease (Flexi-Desk)", amount: officeCost });

        // 6. Market Fees (Innovation/Market fees usually % of Rent + License)
        const marketFee = (licenseFee + officeCost) * rules.marketFeeRate;
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
