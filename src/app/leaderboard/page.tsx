'use client';

import SectionLayout from '@/layouts/SectionLayout';
import TableElement from '@/components/Table/TableElement';
import axios from 'axios';
import { useEffect, useState } from 'react';

const groupByKey = (list: any, key: any) => list.reduce((hash: any, obj: any) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {});


export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);


  useEffect(() => {
    async function getLeaderboard() {
      console.log('gettete');
      const result = await axios.get('https://guarded-reef-64958-6829a10e3dd1.herokuapp.com/leaderboard');
      console.log(result.data);

      const groupped = groupByKey(result.data, 'walletAddress');
      console.log(groupped, Object.keys(groupped));

      setLeaderboard(groupped);
    }

    if(leaderboard.length === 0) {
      getLeaderboard();
    }
  }, [leaderboard]);

  return (
    <SectionLayout>
      <div className="min-h-screen flex flex-col items-center flex-1 gap-8 lg:mt-32 mt-64">
        <h1 className='text-4xl font-semibold text-red-500 before:content-["Leaderboard"] before:scale-105 before:text-white before:absolute'>Leaderboard</h1>

        <table className="table-auto gap-2 border-spacing-2">
          <thead>
            <tr>
              <th>Wallet Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(leaderboard).map((address: any, index) => (
              <TableElement key={index} amount={leaderboard[address].length as number} walletAddress={address} />
            ))}
          </tbody>
        </table>

      </div>

    </SectionLayout>
  );
}
