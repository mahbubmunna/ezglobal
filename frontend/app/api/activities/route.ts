import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
    try {
        // Find the absolute path to the json file. Since we are in frontend/app/api, and data is in backend/data
        // We go up from frontend root to ez_global, then into backend/data
        const jsonDirectory = path.join(process.cwd(), '../backend/data');
        const fileContents = await fs.readFile(jsonDirectory + '/activities.json', 'utf8');
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading activities:", error);
        return NextResponse.json({ error: 'Failed to load activities' }, { status: 500 });
    }
}
