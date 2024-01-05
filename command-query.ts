import { argv } from 'process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const isShowPost = false;
const length = argv.length || 0;
const menuParams = length === 3 ? argv[length - 1] : '--menu=normal';
let menu = 'normal';

switch (menuParams) {
    case '--menu=normal':
        menu = 'normal';
        break;
    case '--menu=cursor':
        menu = 'cursor';
        break;
    case '--menu=byid':
        menu = 'byid';
        break;
}

async function main() {
    const keyword = `command-query-${menu}`;
    console.time(keyword);
    const limit = 10000;
    const postDataTotal = await prisma.posts.count();
    const postPageTotal = Math.ceil(postDataTotal / limit);
    let i = 0;
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
            skip: i * limit,
            take: limit,
        };
        if (menu === 'cursor') {
            Object.assign(options, {
                cursor: {
                    id: lastId,
                },
            });
        } else if (menu === 'byid') {
            Object.assign(options, {
                where: { id: { gte: lastId }},
            });
        }
        const posts = await prisma.posts.findMany(options);
        console.log(`iterate - ${i+1}:`)
        if (posts.length > 0) {
            const firstPost = posts[0];
            const lastPost = posts[posts.length - 1];
            lastId = lastPost.id;
            if (isShowPost) {
                console.log('first post:');
                console.log(firstPost);
            }
            console.log(`last post id: ${lastId} - (${posts.length})`);
        }
        i++;
    }
    console.log(JSON.stringify({ limit, total: postDataTotal, pageTotal: postPageTotal }));
    console.timeEnd(keyword);
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