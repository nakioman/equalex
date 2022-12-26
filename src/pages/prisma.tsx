import React from 'react';
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import { Security, WatchList } from '@prisma/client';

export const getStaticProps: GetStaticProps = async () => {
  const watchLists = await prisma.watchList.findMany({
    where: { userId: 'nacho' },
    include: {
      security: true,
    },
  });
  return {
    props: { watchLists },
  };
};

type Props = {
  watchLists: (WatchList & { security: Security })[];
};

const PrismaTest: React.FC<Props> = (props) => {
  return (
    <>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.watchLists.map((item) => (
            <div key={item.id} className="post">
              <span>{item.security.name}</span>
            </div>
          ))}
        </main>
      </div>
    </>
  );
};

export default PrismaTest;
