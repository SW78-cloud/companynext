import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simulated CIPC Data
const cipcData = [
    {
        name: "Acme Holdings Pty Ltd",
        registrationNumber: "2023/123456/07",
        industry: "Technology",
        city: "Cape Town",
        directors: ["John Doe", "Jane Smith"]
    },
    {
        name: "Global Trade Corp",
        registrationNumber: "2020/987654/07",
        industry: "Logistics",
        city: "Durban",
        directors: ["Mike Brown"]
    },
    {
        name: "Sunshine Retailers",
        registrationNumber: "2015/555111/07",
        industry: "Retail",
        city: "Johannesburg",
        directors: ["Sarah Connor", "Kyle Reese"]
    },
    {
        name: "Tech Innovators",
        registrationNumber: "2024/000001/07",
        industry: "Software",
        city: "Pretoria",
        directors: ["Elon Musk"]
    }
];

async function main() {
    console.log('🚀 Starting CIPC Data Import...');

    for (const company of cipcData) {
        console.log(`Processing ${company.name} (${company.registrationNumber})...`);

        // Upsert company: Update if exists (by CIPC number), Create if not.
        // The 'id' field will be automatically generated as a CUID, serving as the Tenant ID.
        const record = await prisma.company.upsert({
            where: {
                cipcNumber: company.registrationNumber
            },
            update: {
                legalName: company.name,
                industry: company.industry,
                hqCity: company.city,
                aliases: company.directors // Storing directors in aliases for now as a simple example, or ignoring if schema doesn't match perfectly.
                // In a real scenario, we might want a Json field for "directors" or a separate relation.
                // Using aliases for simplicity of the prompt's request.
            },
            create: {
                legalName: company.name,
                cipcNumber: company.registrationNumber,
                industry: company.industry,
                hqCity: company.city,
                aliases: company.directors
            }
        });

        console.log(`✅ Upserted: ${record.legalName} -> Tenant ID: ${record.id}`);
    }

    console.log('🏁 Import completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
