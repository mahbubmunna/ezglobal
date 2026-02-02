import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const partners = parseInt(searchParams.get('partners') || '1');
        const origin = searchParams.get('origin') || 'local'; // local, regional, global

        // 1. Read Data
        const jsonDirectory = path.join(process.cwd(), '../backend/data');
        const fileContents = await fs.readFile(jsonDirectory + '/legal-types.json', 'utf8');
        const legalTypes = JSON.parse(fileContents);

        // 2. Filter Logic
        const filtered = legalTypes.filter((type: any) => {
            // Partner Count Check
            if (partners < type.partners.min || partners > type.partners.max) {
                return false;
            }

            // Nationality Check
            let allowedByNationality = false;
            if (origin === 'local' && type.nationalities.allowUae) allowedByNationality = true;
            else if (origin === 'regional' && type.nationalities.allowGcc) allowedByNationality = true;
            else if (origin === 'global' && type.nationalities.allowExpats) allowedByNationality = true;

            if (!allowedByNationality) return false;

            return true;
        });

        return NextResponse.json(filtered);
    } catch (error) {
        console.error("Error fetching legal types:", error);
        return NextResponse.json({ error: 'Failed to load legal types' }, { status: 500 });
    }
}
