import { PrismaClient } from '../generated/prisma/client';
import bcrypt from 'bcrypt';
import _posts from './data/posts.json';

interface Post {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  tags: string[];
}

const posts = _posts as Post[];

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // seed user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  });

  // seed posts
  for (const post of posts) {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        postedAt: new Date(post.postedAt),
        postedBy: post.postedBy,

        tags: {
          create: post.tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: {
                  name: tagName,
                },
                create: {
                  name: tagName,
                },
              },
            },
          })),
        },
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
