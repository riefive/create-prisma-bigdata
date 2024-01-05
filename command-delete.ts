import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.time('command-delete');
    const result = await prisma.posts.deleteMany({
        where: { id: { gt: 0 } }
    });
    console.log(`total: ${result?.count || 0}`);
    console.timeEnd('command-delete');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });