// import * as cheerio from 'cheerio';

// export type Event = {
//   name: string;
//   date: string;
//   time: string;
//   court: string;
// };

// export async function fetchEvents(): Promise<Event[]> {
//   const res = await fetch("https://labola.jp/r/shop/3274/calendar_week/");
//   const html = await res.text();
//   const $ = cheerio.load(html);

//   const events: Event[] = [];
//   const currentDate = '';

//   $('tr.spaces').each((_, tr) => {
//     const th = $(tr).find('th.day');
//     if (th.length) {
//       currentDate = th.text().trim();
//     }

//     const court = $(tr).find('td.court p').text().trim();

//     $(tr).find('td.slot').each((_, td) => {
//       const text = $(td).text();
//       if (text.includes('オリブルFC')) {
//         const timeMatch = text.match(/\d{2}:\d{2}-\d{2}:\d{2}/);
//         events.push({
//           name: 'オリブルFC',
//           date: currentDate,
//           time: timeMatch ? timeMatch[0] : '',
//           court
//         });
//       }
//     });
//   });

//   return events;
// }
import * as cheerio from 'cheerio';

export type Event = {
  name: string;
  date: string;
  time: string;
  court: string;
};

const NUM_WEEKS = 12; // 取得したい週の数

export async function fetchEvents(): Promise<Event[]> {
  const baseUrl = "https://labola.jp/r/shop/3274/calendar_week";
  const allEvents: Event[] = [];

  // 最初にデフォルトページ取得
  const res = await fetch(baseUrl);
  const html = await res.text();
  const $ = cheerio.load(html);

  // 今週の開始日を取得
  const firstTh = $("tr.spaces th.day").first().text().trim();
  const [month, day] = firstTh.match(/\d+/g)!.map(Number); // ex: "10/5(日)" -> [10,5]
  const year = new Date().getFullYear();

  for (const i = 0; i < NUM_WEEKS; i++) {
    const url =
      i === 0
        ? baseUrl
        : `${baseUrl}/${year}/${month}/${day + i * 7}/?tab_name=%E3%81%99%E3%81%B9%E3%81%A6`;

    const resWeek = await fetch(url);
    const htmlWeek = await resWeek.text();
    const $week = cheerio.load(htmlWeek);

    const currentDate = "";

    $week("tr.spaces").each((_, tr) => {
      const th = $week(tr).find("th.day");
      if (th.length) currentDate = th.text().trim();

      const court = $week(tr).find("td.court p").text().trim();

      $week(tr)
        .find("td.slot")
        .each((_, td) => {
          const text = $week(td).text();
          if (text.includes("オリブルFC")) {
            const timeMatch = text.match(/\d{2}:\d{2}-\d{2}:\d{2}/);
            allEvents.push({
              name: "オリブルFC",
              date: currentDate,
              time: timeMatch ? timeMatch[0] : "",
              court,
            });
          }
        });
    });
  }

  return allEvents;
}