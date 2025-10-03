import * as cheerio from 'cheerio';

export type Event = {
  name: string;
  date: string;
  time: string;
  court: string;
};

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch("https://labola.jp/r/shop/3274/calendar_week/");
  const html = await res.text();
  const $ = cheerio.load(html);

  const events: Event[] = [];
  let currentDate = '';

  $('tr.spaces').each((_, tr) => {
    const th = $(tr).find('th.day');
    if (th.length) {
      currentDate = th.text().trim();
    }

    const court = $(tr).find('td.court p').text().trim();

    $(tr).find('td.slot').each((_, td) => {
      const text = $(td).text();
      if (text.includes('オリブルFC')) {
        const timeMatch = text.match(/\d{2}:\d{2}-\d{2}:\d{2}/);
        events.push({
          name: 'オリブルFC',
          date: currentDate,
          time: timeMatch ? timeMatch[0] : '',
          court
        });
      }
    });
  });

  return events;
}
