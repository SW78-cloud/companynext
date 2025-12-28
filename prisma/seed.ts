import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // Create sample companies
    const companies = await Promise.all([
        prisma.company.create({
            data: {
                legalName: 'Acme Corporation (Pty) Ltd',
                tradingNames: ['Acme Corp', 'Acme'],
                aliases: ['ACME'],
                cipcNumber: '2020/123456/07',
                industry: 'Technology',
            },
        }),
        prisma.company.create({
            data: {
                legalName: 'Global Services SA',
                tradingNames: ['Global Services'],
                cipcNumber: '2019/987654/07',
                industry: 'Consulting',
            },
        }),
        prisma.company.create({
            data: {
                legalName: 'TechStart Solutions',
                tradingNames: ['TechStart'],
                cipcNumber: '2021/456789/07',
                industry: 'Software Development',
            },
        }),
        prisma.company.create({
            data: {
                legalName: 'BuildRight Construction',
                tradingNames: ['BuildRight'],
                cipcNumber: '2018/111222/07',
                industry: 'Construction',
            },
        }),
        prisma.company.create({
            data: {
                legalName: 'FinServe Financial Services',
                tradingNames: ['FinServe'],
                cipcNumber: '2017/333444/07',
                industry: 'Financial Services',
            },
        }),
    ]);

    console.log(`Created ${companies.length} companies`);

    // Create sample case records
    const caseRecords = await Promise.all([
        // Acme Corporation cases
        prisma.caseRecord.create({
            data: {
                companyId: companies[0].id,
                source: 'CCMA',
                sourceUrl: 'https://example.com/case1',
                jurisdiction: 'South Africa - Gauteng',
                caseRef: 'GAJB12345-23',
                year: 2023,
                partiesText: 'John Doe vs Acme Corporation (Pty) Ltd',
                topicTags: ['Unfair Dismissal', 'Labour Dispute'],
                outcomeLabel: 'Dismissed',
                outcomeConfidence: 0.95,
                rawTextHash: 'hash1',
            },
        }),
        prisma.caseRecord.create({
            data: {
                companyId: companies[0].id,
                source: 'CCMA',
                jurisdiction: 'South Africa - Western Cape',
                caseRef: 'WECT23456-22',
                year: 2022,
                partiesText: 'Jane Smith vs Acme Corporation (Pty) Ltd',
                topicTags: ['Unfair Labour Practice'],
                outcomeLabel: 'Settled',
                outcomeConfidence: 0.88,
                rawTextHash: 'hash2',
            },
        }),
        // Global Services cases
        prisma.caseRecord.create({
            data: {
                companyId: companies[1].id,
                source: 'Labour Court',
                jurisdiction: 'South Africa - Gauteng',
                caseRef: 'JR1234/2023',
                year: 2023,
                partiesText: 'Employee Union vs Global Services SA',
                topicTags: ['Collective Bargaining', 'Strike Action'],
                outcomeLabel: 'Upheld',
                outcomeConfidence: 0.92,
                rawTextHash: 'hash3',
            },
        }),
        // TechStart cases
        prisma.caseRecord.create({
            data: {
                companyId: companies[2].id,
                source: 'CCMA',
                jurisdiction: 'South Africa - KwaZulu-Natal',
                caseRef: 'KNDA34567-23',
                year: 2023,
                partiesText: 'Developer vs TechStart Solutions',
                topicTags: ['Constructive Dismissal'],
                outcomeLabel: 'Dismissed',
                outcomeConfidence: 0.85,
                rawTextHash: 'hash4',
            },
        }),
        // BuildRight cases
        prisma.caseRecord.create({
            data: {
                companyId: companies[3].id,
                source: 'CCMA',
                jurisdiction: 'South Africa - Eastern Cape',
                caseRef: 'ECPE45678-22',
                year: 2022,
                partiesText: 'Construction Worker vs BuildRight Construction',
                topicTags: ['Unfair Dismissal', 'Safety Violation'],
                outcomeLabel: 'Upheld',
                outcomeConfidence: 0.93,
                rawTextHash: 'hash5',
            },
        }),
        prisma.caseRecord.create({
            data: {
                companyId: companies[3].id,
                source: 'High Court',
                jurisdiction: 'South Africa - Gauteng',
                caseRef: 'HC2023/12345',
                year: 2023,
                partiesText: 'Contractor vs BuildRight Construction',
                topicTags: ['Contract Dispute', 'Payment'],
                outcomeLabel: 'Settled',
                outcomeConfidence: 0.90,
                rawTextHash: 'hash6',
            },
        }),
    ]);

    console.log(`Created ${caseRecords.length} case records`);

    // Create sample vendors
    const vendors = await Promise.all([
        prisma.vendor.create({
            data: {
                name: 'TalentBridge Recruitment',
                cipcNumber: '2015/555666/07',
            },
        }),
        prisma.vendor.create({
            data: {
                name: 'StaffSolutions',
                cipcNumber: '2016/777888/07',
            },
        }),
    ]);

    console.log(`Created ${vendors.length} vendors`);

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
