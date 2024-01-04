import mocker from 'mocker-data-generator';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let postSchema = {
    slug: {
        faker: 'lorem.slug()'
    },
    title: {
        faker: 'lorem.sentence()'
    },
    content: {
        faker: 'lorem.paragraph()'
    },
    createdAt: {
        faker: 'date.soon()'
    },
    createdBy: {
        function: () => {
            return faker.person.lastName().substring(0, 5);
        }
    },
};

const numbers = 150000; // 15 | 150000 | Math.pow(10, 6) 

mocker()
    .addGenerator('faker', faker)
    .schema('post', postSchema, numbers).build().then(async (data) => {
        try {
            console.time('init');
            const posts = await prisma.post.createMany({
                data: data?.post as any,
                skipDuplicates: true
            });
            console.log(posts);
            await prisma.$disconnect();
            console.timeEnd('init');
        } catch (error) {
            console.error(error);
            await prisma.$disconnect()
            process.exit(1);
        }
    });
