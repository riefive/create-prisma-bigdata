import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.time('find-cursor');
    const limit = 10000;
    const postDataTotal = await prisma.posts.count();
    const postPageTotal = Math.ceil(postDataTotal / limit);
    let i = 0;
    const isCursor = true;
    while (i < postPageTotal) {
        let lastId = 1;
        const options: any = {
            select: {
                id: true,
                slug: true,
                title: true,
                content: true,
                createdAt: true,
                createdBy: true
            },
            orderBy: {
                id: 'asc',
            },
        };
        if (isCursor) {
            Object.assign(options, {
                cursor: {
                    id: lastId,
                },
                skip: i * limit,
                take: limit,
            });
        } else {
            Object.assign(options, {
                where: { id: { gte: lastId }},
                skip: i * limit,
                take: limit,
            });
        }
        const posts = await prisma.posts.findMany(options);
        console.log(`iterate - ${i+1}:`)
        if (posts.length > 0) {
            const lastPost = posts[posts.length - 1];
            console.log(posts[0]);
            console.log('last post id:', lastPost.id);
            lastId = lastPost.id;
        }
        console.log(posts.length);
        i++;
    }
    console.log(JSON.stringify({ limit, total: postDataTotal, pageTotal: postPageTotal }));
    console.timeEnd('find-cursor');
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