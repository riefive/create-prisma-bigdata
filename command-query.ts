import { argv } from 'process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const length = argv.length || 0;
const menuParams = length === 3 ? argv[length - 1] : '--menu=normal';

async function main() {
    console.time('command-find');
    const limit = 10000;
    const postDataTotal = await prisma.posts.count();
    const postPageTotal = Math.ceil(postDataTotal / limit);
    let i = 0;
    while (i < postPageTotal) {
        const options: any = {
            select: {
                id: true,
                slug: true,
                title: true,
                content: true,
                createdAt: true,
                createdBy: true
            },
            skip: i * limit,
            take: limit,
        };
        const posts = await prisma.posts.findMany(options);
        console.log(`iterate - ${i+1}:`)
        if (posts.length > 0) {
            const lastPost = posts[posts.length - 1];
            console.log(posts[0]);
            console.log('last post id:', lastPost.id);
        }
        console.log(posts.length);
        i++;
    }
    console.log(JSON.stringify({ limit, total: postDataTotal, pageTotal: postPageTotal }));
    console.timeEnd('command-find');
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