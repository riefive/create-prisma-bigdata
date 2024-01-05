import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.time('find');
    const posts = await prisma.posts.findMany({
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            createdAt: true,
            createdBy: true
        },
        skip: 0,
        take: 50000,
    });
    if (posts.length > 0) console.log(posts[0]);
    console.log(posts.length);
    console.timeEnd('find');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })