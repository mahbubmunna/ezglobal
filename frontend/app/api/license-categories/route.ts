import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const partners = parseInt(searchParams.get('partners') || '1');
        const origin = searchParams.get('origin') || 'local';
        const legalType = searchParams.get('legalType');

        // 1. Read Data
        const jsonDirectory = path.join(process.cwd(), '../backend/data');
        const fileContents = await fs.readFile(jsonDirectory + '/license-categories.json', 'utf8');
        const licenses = JSON.parse(fileContents);

        // 2. Filter Logic
        const filtered = licenses.filter((lic: any) => {
            // Partner Count Check
            if (partners < lic.partners.min || partners > lic.partners.max) {
                return false;
            }

            // Nationality Check
            let allowedByNationality = false;
            if (lic.allowedNationalities.includes('all')) allowedByNationality = true;
            else if (origin === 'local' && lic.allowedNationalities.includes('uae')) allowedByNationality = true;
            else if (origin === 'regional' && lic.allowedNationalities.includes('gcc')) allowedByNationality = true;
            else if (origin === 'global' && lic.allowedNationalities.includes('expat')) allowedByNationality = true;

            if (!allowedByNationality) return false;

            // Legal Type Check
            if (legalType) {
                if (!lic.allowedLegalTypes.includes('all') && !lic.allowedLegalTypes.includes(legalType)) {
                    return false;
                }
            }

            return true;
        });

        return NextResponse.json(filtered);

    } catch (error) {
        console.error("Error fetching license categories:", error);
        return NextResponse.json({ error: 'Failed to load license categories' }, { status: 500 });
    }
}
