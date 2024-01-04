import mocker from 'mocker-data-generator';
import { faker } from '@faker-js/faker';

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

mocker()
.addGenerator('faker', faker)
.schema('post', postSchema, 15).build().then(data => {
    console.log(data);
});
