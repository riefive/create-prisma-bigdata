import mocker from 'mocker-data-generator';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let postSchema = {
    slug: {
        function: () => {
            const isRandom = false;
            if (isRandom) {
                const randomId = (Math.random() + 1).toString(36).substring(7);
                return faker.lorem.slug() + ''.concat(`-${randomId}`);
            }
            return faker.lorem.slug();
        }
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

const numbers = Math.pow(10, 5); // 15 | 150000 | Math.pow(10, 5) | Math.pow(10, 6) 

mocker()
    .addGenerator('faker', faker)
    .schema('posts', postSchema, numbers).build().then(async (data) => {
        try {
            const isMulti = false;
            console.time('init');
            const postRaws = data?.posts || [];
            if (isMulti) { // with multi insert normal
                const posts = await prisma.posts.createMany({
                    data: postRaws as any,
                    skipDuplicates: true
                });
                console.log(`post saved ${posts} => ${numbers}`);
            } else { // with chunk arrays
                const isMany = true;
                const limit = 1000;
                let i = 0;
                while(i < postRaws.length) {
                    const items = postRaws.slice(i, i + limit);
                    if (isMany) {
                        await prisma.posts.createMany({
                            data: items as any,
                            skipDuplicates: true
                        });
                    } else {
                        for (let index = 0; index < items.length; index++) {
                            await prisma.posts.create({
                                data: items[index]
                            });
                        }
                    }
                    i = i + items.length;
                    console.log(`post times ${i} => ${numbers}`);
                }
            }
            await prisma.$disconnect();
            console.timeEnd('init');
        } catch (error) {
            console.error(error);
            await prisma.$disconnect()
            process.exit(1);
        }
    });
