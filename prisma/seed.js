import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const games = [
  {
    name: 'Chess',
    description: 'A strategic board game of skill',
    genre: 'Strategy',
    platform: 'PC',
    releaseDate: new Date('2000-01-01'),
  },
  {
    name: 'Fortnite',
    description: 'A battle royale game with building mechanics',
    genre: 'Battle Royale',
    platform: 'PC, Console',
    releaseDate: new Date('2017-07-25'),
  },
  {
    name: 'Valorant',
    description: 'A 5v5 character-based tactical shooter',
    genre: 'First-Person Shooter (FPS)',
    platform: 'PC',
    releaseDate: new Date('2020-06-02'),
  },
  {
    name: 'FIFA 23',
    description: 'The latest entry in the football simulation series',
    genre: 'Sports',
    platform: 'PC, Console',
    releaseDate: new Date('2022-09-30'),
  },
  {
    name: 'Minecraft',
    description: 'A sandbox game about breaking and placing blocks',
    genre: 'Sandbox',
    platform: 'PC, Console, Mobile',
    releaseDate: new Date('2011-11-18'),
  },
  {
    name: 'League of Legends',
    description: 'A multiplayer online battle arena (MOBA)',
    genre: 'MOBA',
    platform: 'PC',
    releaseDate: new Date('2009-10-27'),
  },
  {
    name: 'Call of Duty: Warzone',
    description: 'A free-to-play battle royale',
    genre: 'Battle Royale',
    platform: 'PC, Console',
    releaseDate: new Date('2020-03-10'),
  },
  {
    name: 'The Legend of Zelda: Breath of the Wild',
    description: 'An open-world action-adventure game',
    genre: 'Action-Adventure',
    platform: 'Console',
    releaseDate: new Date('2017-03-03'),
  },
  {
    name: 'Among Us',
    description: 'A multiplayer party game about teamwork and betrayal',
    genre: 'Party Game',
    platform: 'PC, Mobile',
    releaseDate: new Date('2018-06-15'),
  },
  {
    name: 'Rocket League',
    description: 'A soccer game with rocket-powered cars',
    genre: 'Sports',
    platform: 'PC, Console',
    releaseDate: new Date('2015-07-07'),
  },
  {
    name: 'Overwatch 2',
    description: 'A team-based multiplayer first-person shooter',
    genre: 'First-Person Shooter (FPS)',
    platform: 'PC, Console',
    releaseDate: new Date('2022-10-04'),
  },
  {
    name: 'Apex Legends',
    description: 'A battle royale game set in the Titanfall universe',
    genre: 'Battle Royale',
    platform: 'PC, Console',
    releaseDate: new Date('2019-02-04'),
  },
  {
    name: 'Genshin Impact',
    description: 'An open-world action RPG',
    genre: 'Action RPG',
    platform: 'PC, Console, Mobile',
    releaseDate: new Date('2020-09-28'),
  },
  {
    name: 'Cyberpunk 2077',
    description: 'An open-world RPG set in a dystopian future',
    genre: 'Action RPG',
    platform: 'PC, Console',
    releaseDate: new Date('2020-12-10'),
  },
  {
    name: 'Animal Crossing: New Horizons',
    description: 'A social simulation game set on a deserted island',
    genre: 'Simulation',
    platform: 'Console',
    releaseDate: new Date('2020-03-20'),
  },
  {
    name: 'PUBG',
    description: 'A battle royale game',
    genre: 'Battle Royale',
    platform: 'PC, Console',
    releaseDate: new Date('2017-12-20'),
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    description: 'An open-world RPG with rich storytelling',
    genre: 'Action RPG',
    platform: 'PC, Console',
    releaseDate: new Date('2015-05-19'),
  },
  {
    name: 'Dota 2',
    description: 'A multiplayer online battle arena',
    genre: 'MOBA',
    platform: 'PC',
    releaseDate: new Date('2013-07-09'),
  },
  {
    name: 'Red Dead Redemption 2',
    description: 'An open-world Western-themed action-adventure',
    genre: 'Action-Adventure',
    platform: 'PC, Console',
    releaseDate: new Date('2018-10-26'),
  },
  {
    name: 'Halo Infinite',
    description: 'A sci-fi first-person shooter',
    genre: 'First-Person Shooter (FPS)',
    platform: 'PC, Console',
    releaseDate: new Date('2021-12-08'),
  },
];

async function main() {
  for (const game of games) {
    await prisma.game.create({
      data: game,
    });
  }
  console.log('Sample games added to the database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
