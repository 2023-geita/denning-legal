import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

interface SessionRow {
  'Session ID': string;
  'Attorney': string;
  'Matter': string;
  'Date': string;
  'Start Time': string;
  'End Time': string;
  'Duration (minutes)': string;
  'Status': string;
  'Billable': string;
  'Notes': string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { startDate, endDate } = req.query;

    const sessions = await prisma.billableSession.findMany({
      where: {
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Format data for CSV
    const csvData: SessionRow[] = sessions.map((session) => ({
      'Session ID': session.id,
      'Attorney': session.attorney,
      'Matter': session.matterName,
      'Date': session.date.toLocaleDateString(),
      'Start Time': session.startTime.toLocaleString(),
      'End Time': session.endTime?.toLocaleString() || 'N/A',
      'Duration (minutes)': session.duration.toString(),
      'Status': session.status,
      'Billable': session.billable ? 'Yes' : 'No',
      'Notes': session.notes || '',
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]) as (keyof SessionRow)[];
    const csv = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sessions-export.csv');
    
    return res.status(200).send(csv);
  } catch (error) {
    console.error('Failed to export sessions:', error);
    return res.status(500).json({ error: 'Failed to export sessions' });
  }
} 