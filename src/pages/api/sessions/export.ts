import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/db';
import { formatDate, formatTime } from '@/utils/format';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { startDate, endDate, matterId, attorney } = req.query;
    const db = await getDb();
    const collection = db.collection('sessions');

    const query: any = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (matterId) {
      query.matterId = matterId;
    }

    if (attorney) {
      query.attorney = attorney;
    }

    const sessions = await collection
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'matters',
            localField: 'matterId',
            foreignField: '_id',
            as: 'matter'
          }
        },
        { $unwind: '$matter' },
        {
          $project: {
            date: 1,
            startTime: 1,
            endTime: 1,
            duration: 1,
            attorney: 1,
            notes: 1,
            billable: 1,
            billingRate: 1,
            matterName: '$matter.name',
            clientName: '$matter.client'
          }
        },
        { $sort: { date: 1, startTime: 1 } }
      ])
      .toArray();

    // Calculate totals
    const totals = sessions.reduce((acc, session) => ({
      totalHours: acc.totalHours + (session.duration / 60),
      billableHours: acc.billableHours + (session.billable ? session.duration / 60 : 0),
      billableAmount: acc.billableAmount + (session.billable ? (session.duration / 60) * session.billingRate : 0)
    }), { totalHours: 0, billableHours: 0, billableAmount: 0 });

    // Format data for CSV
    const csvRows = [
      // Header row
      ['Date', 'Matter', 'Client', 'Attorney', 'Start Time', 'End Time', 'Duration (hrs)', 'Billable', 'Rate', 'Amount', 'Notes'].join(','),
      // Data rows
      ...sessions.map(session => [
        formatDate(session.date),
        `"${session.matterName}"`,
        `"${session.clientName}"`,
        session.attorney,
        formatTime(session.startTime),
        session.endTime ? formatTime(session.endTime) : '',
        (session.duration / 60).toFixed(2),
        session.billable ? 'Yes' : 'No',
        session.billable ? `$${session.billingRate.toFixed(2)}` : '',
        session.billable ? `$${((session.duration / 60) * session.billingRate).toFixed(2)}` : '',
        `"${session.notes || ''}"`
      ].join(',')),
      // Summary rows
      '',
      ['Total Hours:', totals.totalHours.toFixed(2)].join(','),
      ['Billable Hours:', totals.billableHours.toFixed(2)].join(','),
      ['Total Billable Amount:', `$${totals.billableAmount.toFixed(2)}`].join(',')
    ].join('\n');

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=timesheet-${formatDate(new Date())}.csv`);

    res.status(200).send(csvRows);
  } catch (error) {
    console.error('Failed to export sessions:', error);
    res.status(500).json({ error: 'Failed to export sessions' });
  }
} 