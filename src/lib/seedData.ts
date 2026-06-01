import type { GroupKey, Subject, SubjectWithSyllabus } from './types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HSC 2026 — SUGGESTION CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Real HSC 2026 (Bangladesh board) chapter structure with predicted question
 *  counts and topic importance weights.
 *
 *  Mark distribution this year:
 *   - Science practical subjects (Physics, Chemistry, Biology, Higher Math, ICT):
 *     CQ 50 (answer 5) + MCQ 25 + Practical 25.
 *   - Non-practical (Accounting, Finance, Business Org, Economics, Civics, Logic)
 *     and Bangla: CQ 70 (answer 7) + MCQ 30.
 *   - English 1st/2nd: 100 written marks each (no MCQ/CQ) — modelled in the SQ
 *     bucket. No other subject has an SQ section.
 *
 *  `weight` (0–100) is the suggestion/importance of a topic; per-chapter `mcq`
 *  is the predicted number of MCQ from that chapter. In demo mode this data
 *  backs the app; with Supabase configured the DB is the source of truth (see
 *  supabase/seed.sql, regenerate with `npm run gen:seed`).
 */

type RawTopic = [title: string, weight: number]

interface RawChapter {
  title: string
  mcq?: number
  sq?: number
  topics: RawTopic[]
}

interface RawSection {
  title: string
  minCq?: number
  availCq?: number
  chapters: RawChapter[]
}

interface RawSubject {
  id: string
  title: string
  short: string
  icon: string
  groups: Partial<Record<GroupKey, number>>
  marks: { cq: number; mcq: number; sq?: number; cqVal?: number; sqVal?: number }
  sections: RawSection[]
}

const RAW: RawSubject[] = [
  // ── SCIENCE ───────────────────────────────────────────────────────────────
  {
    id: 'phy1',
    title: 'পদার্থবিজ্ঞান ১ম পত্র',
    short: 'Physics 1st',
    icon: '⚛️',
    groups: { science: 1 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'ক বিভাগ — যান্ত্রিকবিদ্যা',
        minCq: 3,
        availCq: 5,
        chapters: [
          { title: '১ম অধ্যায়: ভৌত জগৎ ও পরিমাপ', mcq: 2, topics: [['মাত্রা ও মাত্রিক সমীকরণ', 90], ['পরিমাপের ত্রুটি ও তাৎপর্যপূর্ণ অঙ্ক', 70], ['স্লাইড ক্যালিপার্স ও স্ক্রু গজ', 55]] },
          { title: '২য় অধ্যায়: ভেক্টর', mcq: 3, topics: [['স্কেলার ও ভেক্টর গুণন', 90], ['ভেক্টরের লব্ধি ও উপাংশ', 80], ['ডেল অপারেটর ও গ্রেডিয়েন্ট', 60]] },
          { title: '৩য় অধ্যায়: গতিবিদ্যা', mcq: 3, topics: [['প্রাসের গতি (Projectile)', 95], ['গতির সমীকরণ ও লেখচিত্র', 75], ['আপেক্ষিক বেগ', 55]] },
          { title: '৪র্থ অধ্যায়: নিউটনিয়ান বলবিদ্যা', mcq: 3, topics: [['নিউটনের সূত্র ও ভরবেগ সংরক্ষণ', 90], ['কেন্দ্রমুখী বল ও ঘূর্ণন', 70], ['ঘর্ষণ', 55]] },
          { title: '৫ম অধ্যায়: কাজ, ক্ষমতা ও শক্তি', mcq: 2, topics: [['কাজ-শক্তি উপপাদ্য', 85], ['সংরক্ষণশীল বল ও বিভব শক্তি', 65], ['ক্ষমতা ও দক্ষতা', 50]] },
        ],
      },
      {
        title: 'খ বিভাগ — পদার্থের ধর্ম, গতি ও তাপ',
        minCq: 2,
        availCq: 5,
        chapters: [
          { title: '৬ষ্ঠ অধ্যায়: মহাকর্ষ ও অভিকর্ষ', mcq: 2, topics: [['কেপলারের সূত্র ও মহাকর্ষীয় বিভব', 80], ['মুক্তিবেগ ও কৃত্রিম উপগ্রহ', 75], ['g-এর তারতম্য', 55]] },
          { title: '৭ম অধ্যায়: পদার্থের গাঠনিক ধর্ম', mcq: 3, topics: [['পীড়ন, বিকৃতি ও ইয়ং গুণাঙ্ক', 90], ['পৃষ্ঠটান ও সান্দ্রতা', 70], ['স্থিতিস্থাপক বিভব শক্তি', 55]] },
          { title: '৮ম অধ্যায়: পর্যাবৃত্ত গতি', mcq: 3, topics: [['সরল ছন্দিত স্পন্দন (SHM)', 95], ['সরল দোলক', 70], ['শক্তির রূপান্তর', 55]] },
          { title: '৯ম অধ্যায়: তরঙ্গ', mcq: 2, topics: [['অগ্রগামী ও স্থির তরঙ্গ', 80], ['স্বরকম্পাঙ্ক ও সুরশলাকা', 65], ['ডপলার ক্রিয়া', 60]] },
          { title: '১০ম অধ্যায়: আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব', mcq: 2, topics: [['গ্যাসের সূত্র ও আদর্শ গ্যাস সমীকরণ', 80], ['গতিতত্ত্ব ও মূল গড় বর্গবেগ', 70], ['গড় গতিশক্তি ও তাপমাত্রা', 50]] },
        ],
      },
    ],
  },
  {
    id: 'phy2',
    title: 'পদার্থবিজ্ঞান ২য় পত্র',
    short: 'Physics 2nd',
    icon: '🧲',
    groups: { science: 2 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'ক বিভাগ — তাপ ও তড়িৎ',
        minCq: 3,
        availCq: 5,
        chapters: [
          { title: '১ম অধ্যায়: তাপগতিবিদ্যা', mcq: 3, topics: [['তাপগতিবিদ্যার ১ম ও ২য় সূত্র', 90], ['কার্নো চক্র ও দক্ষতা', 80], ['এনট্রপি', 55]] },
          { title: '২য় অধ্যায়: স্থির তড়িৎ', mcq: 3, topics: [['কুলম্বের সূত্র ও তড়িৎক্ষেত্র', 85], ['ধারক ও ধারকত্ব', 85], ['তড়িৎ বিভব ও শক্তি', 65]] },
          { title: '৩য় অধ্যায়: চল তড়িৎ', mcq: 3, topics: [['ওহমের সূত্র ও রোধের সমন্বয়', 80], ['কির্শফের সূত্র ও হুইটস্টোন ব্রিজ', 90], ['মিটার ব্রিজ ও পটেনশিওমিটার', 65]] },
          { title: '৪র্থ অধ্যায়: তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', mcq: 2, topics: [['বায়োট-স্যাভার্ট ও অ্যাম্পিয়ারের সূত্র', 80], ['চৌম্বক ক্ষেত্রে গতিশীল আধান ও তার', 70]] },
        ],
      },
      {
        title: 'খ বিভাগ — আলো ও আধুনিক পদার্থবিজ্ঞান',
        minCq: 2,
        availCq: 6,
        chapters: [
          { title: '৫ম অধ্যায়: তাড়িতচৌম্বকীয় আবেশ ও পরিবর্তী প্রবাহ', mcq: 2, topics: [['ফ্যারাডে ও লেঞ্জের সূত্র', 85], ['স্বআবেশ ও পারস্পরিক আবেশ', 65], ['AC বর্তনী ও RMS মান', 60]] },
          { title: '৬ষ্ঠ অধ্যায়: জ্যামিতিক আলোকবিজ্ঞান', mcq: 2, topics: [['লেন্স ও দর্পণ সমীকরণ', 80], ['প্রতিসরণ ও মোট অভ্যন্তরীণ প্রতিফলন', 70], ['অণুবীক্ষণ ও দূরবীক্ষণ যন্ত্র', 55]] },
          { title: '৭ম অধ্যায়: ভৌত আলোকবিজ্ঞান', mcq: 2, topics: [['ব্যতিচার ও ইয়ংয়ের দ্বি-চিড় পরীক্ষা', 80], ['অপবর্তন', 60], ['সমবর্তন', 50]] },
          { title: '৮ম অধ্যায়: আধুনিক পদার্থবিজ্ঞানের সূচনা', mcq: 2, topics: [['বিশেষ আপেক্ষিকতা', 70], ['ফটোতড়িৎ ক্রিয়া', 90]] },
          { title: '৯ম অধ্যায়: পরমাণুর মডেল ও নিউক্লিয়ার পদার্থবিজ্ঞান', mcq: 3, topics: [['বোর মডেল ও হাইড্রোজেন বর্ণালি', 80], ['তেজস্ক্রিয়তা ও অর্ধায়ু', 80], ['ভর-শক্তি ও বন্ধন শক্তি', 65]] },
          { title: '১০ম অধ্যায়: সেমিকন্ডাক্টর ও ইলেকট্রনিক্স', mcq: 3, topics: [['p-n জাংশন ও ডায়োড', 80], ['ট্রানজিস্টর ও বিবর্ধক', 70], ['লজিক গেইট', 70]] },
        ],
      },
    ],
  },
  {
    id: 'chem1',
    title: 'রসায়ন ১ম পত্র',
    short: 'Chemistry 1st',
    icon: '⚗️',
    groups: { science: 3 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 8,
        chapters: [
          { title: '১ম অধ্যায়: ল্যাবরেটরির নিরাপদ ব্যবহার', mcq: 2, topics: [['রাসায়নিক দ্রব্যের সংরক্ষণ ও সংকেত', 60], ['দুর্ঘটনা ও প্রাথমিক চিকিৎসা', 45]] },
          { title: '২য় অধ্যায়: গুণগত রসায়ন', mcq: 6, topics: [['বোর মডেল ও কোয়ান্টাম সংখ্যা', 90], ['ইলেকট্রন বিন্যাস ও আউফবাউ নীতি', 85], ['শিখা পরীক্ষা ও মূলক সনাক্তকরণ', 75], ['দ্রাব্যতা ও দ্রাব্যতা গুণফল', 70]] },
          { title: '৩য় অধ্যায়: মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', mcq: 6, topics: [['সংকরায়ন ও অণুর আকৃতি', 95], ['পর্যায়বৃত্ত ধর্ম', 80], ['বন্ধন, পোলারিটি ও আন্তঃআণবিক বল', 75]] },
          { title: '৪র্থ অধ্যায়: রাসায়নিক পরিবর্তন', mcq: 6, topics: [['রাসায়নিক সাম্যাবস্থা ও Kc/Kp', 95], ['লা-শাতেলিয়ার নীতি', 85], ['বিক্রিয়ার হার ও প্রভাবক', 70], ['pH, প্রশমন ও বাফার', 80]] },
          { title: '৫ম অধ্যায়: কর্মমুখী রসায়ন', mcq: 5, topics: [['তেল-চর্বি, সাবান ও পরিষ্কারক', 65], ['খাদ্য সংরক্ষণ ও সংরক্ষক', 60], ['ধাতু নিষ্কাশন ও সংকর', 55]] },
        ],
      },
    ],
  },
  {
    id: 'chem2',
    title: 'রসায়ন ২য় পত্র',
    short: 'Chemistry 2nd',
    icon: '🧪',
    groups: { science: 4 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 8,
        chapters: [
          { title: '১ম অধ্যায়: পরিবেশ রসায়ন', mcq: 3, topics: [['গ্যাসীয় অবস্থা ও গ্যাস সূত্র', 80], ['বায়ুমণ্ডল ও বায়ুদূষণ', 60]] },
          { title: '২য় অধ্যায়: জৈব রসায়ন', mcq: 7, topics: [['হাইড্রোকার্বন ও কার্যকরী মূলক', 90], ['বিক্রিয়া কৌশল ও সমাণুতা', 90], ['অ্যালকোহল, অ্যালডিহাইড ও কারবক্সিলিক অ্যাসিড', 85], ['পরিশোধন ও সনাক্তকরণ বিক্রিয়া', 70]] },
          { title: '৩য় অধ্যায়: পরিমাণগত রসায়ন', mcq: 6, topics: [['মোলারিটি ও টাইট্রেশন (অম্ল-ক্ষার)', 95], ['জারণ-বিজারণ টাইট্রেশন', 80], ['গ্যাসীয় আয়তন ও স্টয়কিওমিতি', 70]] },
          { title: '৪র্থ অধ্যায়: তড়িৎ রসায়ন', mcq: 5, topics: [['গ্যালভানিক কোষ ও তড়িৎদ্বার বিভব', 85], ['তড়িৎ বিশ্লেষণ ও ফ্যারাডের সূত্র', 80], ['নার্নস্ট সমীকরণ', 60]] },
          { title: '৫ম অধ্যায়: অর্থনৈতিক রসায়ন', mcq: 4, topics: [['অ্যামোনিয়া ও সালফিউরিক এসিড উৎপাদন', 65], ['গ্লাস, সিমেন্ট ও সিরামিক', 55]] },
        ],
      },
    ],
  },
  {
    id: 'hmath1',
    title: 'উচ্চতর গণিত ১ম পত্র',
    short: 'Higher Math 1st',
    icon: '📐',
    groups: { science: 5 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 8,
        chapters: [
          { title: '১ম অধ্যায়: ম্যাট্রিক্স ও নির্ণায়ক', mcq: 2, topics: [['নির্ণায়কের ধর্ম ও মান', 80], ['বিপরীত ম্যাট্রিক্স ও সমীকরণ সমাধান', 85]] },
          { title: '২য় অধ্যায়: ভেক্টর', mcq: 2, topics: [['স্কেলার ও ভেক্টর গুণন', 80], ['ভেক্টরের জ্যামিতিক প্রয়োগ', 60]] },
          { title: '৩য় অধ্যায়: সরলরেখা', mcq: 3, topics: [['রেখার সমীকরণ ও ঢাল', 80], ['দুই রেখার অন্তর্ভুক্ত কোণ ও দূরত্ব', 70]] },
          { title: '৪র্থ অধ্যায়: বৃত্ত', mcq: 3, topics: [['বৃত্তের সাধারণ সমীকরণ', 85], ['স্পর্শক ও জ্যা', 70]] },
          { title: '৫ম অধ্যায়: বিন্যাস ও সমাবেশ', mcq: 3, topics: [['বিন্যাস (nPr)', 75], ['সমাবেশ (nCr)', 80]] },
          { title: '৬ষ্ঠ অধ্যায়: ত্রিকোণমিতিক অনুপাত', mcq: 2, topics: [['মৌলিক অভেদ ও মান নির্ণয়', 70]] },
          { title: '৭ম অধ্যায়: সংযুক্ত কোণের ত্রিকোণমিতিক অনুপাত', mcq: 2, topics: [['যোগ-বিয়োগ ও একাধিক কোণের সূত্র', 80]] },
          { title: '৮ম অধ্যায়: ফাংশন ও ফাংশনের লেখচিত্র', mcq: 2, topics: [['ডোমেন-রেঞ্জ ও লেখচিত্র', 70]] },
          { title: '৯ম অধ্যায়: অন্তরীকরণ', mcq: 3, topics: [['অন্তরজের সূত্রাবলি', 95], ['সর্বোচ্চ-সর্বনিম্ন ও স্পর্শক-অভিলম্ব', 85]] },
          { title: '১০ম অধ্যায়: যোগজীকরণ', mcq: 3, topics: [['মৌলিক ও প্রতিস্থাপন যোগজ', 90], ['নির্দিষ্ট যোগজ ও ক্ষেত্রফল', 80]] },
        ],
      },
    ],
  },
  {
    id: 'hmath2',
    title: 'উচ্চতর গণিত ২য় পত্র',
    short: 'Higher Math 2nd',
    icon: '➗',
    groups: { science: 6 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 8,
        chapters: [
          { title: '১ম অধ্যায়: জটিল সংখ্যা', mcq: 3, topics: [['মডুলাস, আর্গুমেন্ট ও পোলার রূপ', 80], ['ঘনমূল ও De Moivre উপপাদ্য', 75]] },
          { title: '২য় অধ্যায়: বহুপদী ও বহুপদী সমীকরণ', mcq: 3, topics: [['মূল ও সহগের সম্পর্ক', 80], ['ভাগশেষ ও উৎপাদক উপপাদ্য', 65]] },
          { title: '৩য় অধ্যায়: দ্বিপদী বিস্তৃতি', mcq: 3, topics: [['সাধারণ পদ ও নির্দিষ্ট পদ', 90], ['মধ্যপদ ও সহগ নির্ণয়', 75]] },
          { title: '৪র্থ অধ্যায়: কনিক', mcq: 4, topics: [['পরাবৃত্ত (Parabola)', 85], ['উপবৃত্ত ও অধিবৃত্ত', 80]] },
          { title: '৫ম অধ্যায়: বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ', mcq: 3, topics: [['বিপরীত অনুপাতের মান', 70], ['ত্রিকোণমিতিক সমীকরণের সাধারণ সমাধান', 80]] },
          { title: '৬ষ্ঠ অধ্যায়: স্থিতিবিদ্যা', mcq: 3, topics: [['লামির উপপাদ্য ও বলের সাম্য', 75], ['ঘর্ষণ ও বলের ভ্রামক', 60]] },
          { title: '৭ম অধ্যায়: সমতলে বস্তুকণার গতি', mcq: 3, topics: [['গতির সমীকরণ ও প্রাস', 80], ['আপেক্ষিক বেগ ও প্রক্ষেপ', 60]] },
          { title: '৮ম অধ্যায়: বিস্তার পরিমাপ ও সম্ভাবনা', mcq: 3, topics: [['পরিমিত ব্যবধান ও ভেদাঙ্ক', 75], ['সম্ভাবনার যোগ ও গুণ বিধি', 85]] },
        ],
      },
    ],
  },
  {
    id: 'bio1',
    title: 'জীববিজ্ঞান ১ম পত্র (উদ্ভিদবিজ্ঞান)',
    short: 'Biology 1st',
    icon: '🌿',
    groups: { science: 7 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 8,
        chapters: [
          { title: '১ম অধ্যায়: কোষ ও এর গঠন', mcq: 2, topics: [['প্লাজমা মেমব্রেন ও মাইটোকন্ড্রিয়া', 80], ['প্লাস্টিড ও নিউক্লিয়াস', 70]] },
          { title: '২য় অধ্যায়: কোষ বিভাজন', mcq: 3, topics: [['মাইটোসিস', 85], ['মিয়োসিস', 95]] },
          { title: '৩য় অধ্যায়: কোষ রসায়ন', mcq: 2, topics: [['কার্বোহাইড্রেট, প্রোটিন ও লিপিড', 75], ['এনজাইম ও নিউক্লিক অ্যাসিড', 70]] },
          { title: '৪র্থ অধ্যায়: অণুজীব', mcq: 2, topics: [['ভাইরাস', 80], ['ব্যাকটেরিয়া ও ম্যালেরিয়া পরজীবী', 70]] },
          { title: '৫ম অধ্যায়: শৈবাল ও ছত্রাক', mcq: 2, topics: [['শৈবাল (Spirogyra)', 70], ['ছত্রাক (Agaricus) ও লাইকেন', 65]] },
          { title: '৬ষ্ঠ অধ্যায়: ব্রায়োফাইটা ও টেরিডোফাইটা', mcq: 2, topics: [['Pteris ও জীবনচক্র', 65], ['ব্রায়োফাইটার বৈশিষ্ট্য', 55]] },
          { title: '৭ম অধ্যায়: নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', mcq: 2, topics: [['Cycas ও নগ্নবীজীর বৈশিষ্ট্য', 65], ['আবৃতবীজী ও গোত্র (Malvaceae, Poaceae)', 70]] },
          { title: '৮ম অধ্যায়: টিস্যু ও টিস্যুতন্ত্র', mcq: 2, topics: [['ভাজক ও স্থায়ী টিস্যু', 75], ['ভাস্কুলার বান্ডল', 65]] },
          { title: '৯ম অধ্যায়: উদ্ভিদ শারীরতত্ত্ব', mcq: 3, topics: [['সালোকসংশ্লেষণ', 95], ['শ্বসন', 85], ['প্রস্বেদন ও খনিজ পুষ্টি', 65]] },
          { title: '১০ম অধ্যায়: উদ্ভিদ প্রজনন', mcq: 2, topics: [['পরাগায়ন ও নিষেক', 75], ['জনুক্রম', 60]] },
          { title: '১১তম অধ্যায়: জীবপ্রযুক্তি', mcq: 2, topics: [['টিস্যু কালচার', 80], ['রিকম্বিন্যান্ট DNA ও PCR', 75]] },
          { title: '১২তম অধ্যায়: জীবের পরিবেশগত সম্পর্ক', mcq: 1, topics: [['বাস্তুতন্ত্র ও খাদ্যশৃঙ্খল', 55]] },
        ],
      },
    ],
  },
  {
    id: 'bio2',
    title: 'জীববিজ্ঞান ২য় পত্র (প্রাণিবিজ্ঞান)',
    short: 'Biology 2nd',
    icon: '🐾',
    groups: { science: 8 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 8,
        chapters: [
          { title: '১ম অধ্যায়: প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', mcq: 2, topics: [['পর্ব ও শনাক্তকারী বৈশিষ্ট্য', 80], ['দ্বিপদ নামকরণ', 55]] },
          { title: '২য় অধ্যায়: প্রাণীর পরিচিতি', mcq: 3, topics: [['ঘাসফড়িং', 85], ['রুই মাছ', 80], ['হাইড্রা', 60]] },
          { title: '৩য় অধ্যায়: পরিপাক ও শোষণ', mcq: 2, topics: [['পরিপাকতন্ত্র ও এনজাইম', 80], ['শোষণ ও বিপাক', 60]] },
          { title: '৪র্থ অধ্যায়: রক্ত ও সংবহন', mcq: 3, topics: [['হৃৎপিণ্ড ও কার্ডিয়াক চক্র', 95], ['রক্তের উপাদান ও রক্তবাহিকা', 75]] },
          { title: '৫ম অধ্যায়: শ্বসন ও শ্বাসক্রিয়া', mcq: 2, topics: [['শ্বসনতন্ত্র ও গ্যাস বিনিময়', 80], ['শ্বসনের ক্রিয়াকৌশল', 60]] },
          { title: '৬ষ্ঠ অধ্যায়: বর্জ্য ও নিষ্কাশন', mcq: 2, topics: [['বৃক্ক ও নেফ্রন', 85], ['মূত্র তৈরির প্রক্রিয়া', 65]] },
          { title: '৭ম অধ্যায়: চলন ও অঙ্গচালনা', mcq: 2, topics: [['অস্থি, সন্ধি ও পেশি', 70], ['মানব কঙ্কালতন্ত্র', 55]] },
          { title: '৮ম অধ্যায়: সমন্বয় ও নিয়ন্ত্রণ', mcq: 2, topics: [['নিউরন ও স্নায়ু সঞ্চালন', 85], ['হরমোন ও অন্তঃক্ষরা গ্রন্থি', 70]] },
          { title: '৯ম অধ্যায়: মানব জীবনের ধারাবাহিকতা', mcq: 2, topics: [['জননতন্ত্র ও গ্যামেট সৃষ্টি', 75], ['ঋতুচক্র ও অমরা', 60]] },
          { title: '১০ম অধ্যায়: মানবদেহের প্রতিরক্ষা', mcq: 1, topics: [['অনাক্রম্যতা ও অ্যান্টিবডি', 65]] },
          { title: '১১তম অধ্যায়: জিনতত্ত্ব ও বিবর্তন', mcq: 3, topics: [['মেন্ডেলের সূত্র ও ক্রস', 95], ['রক্তের গ্রুপ ও সেক্স-লিংকড বৈশিষ্ট্য', 80], ['বিবর্তন তত্ত্ব', 55]] },
          { title: '১২তম অধ্যায়: প্রাণীর আচরণ', mcq: 1, topics: [['সহজাত ও শিক্ষণ আচরণ', 50]] },
        ],
      },
    ],
  },
  {
    id: 'ict',
    title: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    short: 'ICT',
    icon: '💻',
    groups: { science: 9, business: 9, humanities: 9 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 6,
        chapters: [
          { title: '১ম অধ্যায়: বিশ্ব ও বাংলাদেশ প্রেক্ষিত', mcq: 3, topics: [['বায়োমেট্রিক্স, রোবোটিক্স ও AI', 75], ['ভার্চুয়াল রিয়েলিটি ও বায়োইনফরমেট্রিক্স', 65], ['ন্যানোটেকনোলজি ও জেনেটিক ইঞ্জিনিয়ারিং', 60]] },
          { title: '২য় অধ্যায়: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', mcq: 4, topics: [['ডেটা ট্রান্সমিশন মোড ও মাধ্যম', 85], ['নেটওয়ার্ক টপোলজি ও ডিভাইস', 85], ['ক্লাউড ও মোবাইল প্রজন্ম', 60]] },
          { title: '৩য় অধ্যায়: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', mcq: 5, topics: [['সংখ্যা পদ্ধতি রূপান্তর ও কোড', 95], ['লজিক গেইট ও বুলিয়ান অ্যালজেবরা', 95], ['অ্যাডার, এনকোডার ও রেজিস্টার', 75]] },
          { title: '৪র্থ অধ্যায়: ওয়েব ডিজাইন ও HTML', mcq: 4, topics: [['HTML ট্যাগ, টেবিল ও তালিকা', 90], ['হাইপারলিংক, ইমেজ ও ফর্ম', 70]] },
          { title: '৫ম অধ্যায়: প্রোগ্রামিং ভাষা (C)', mcq: 5, topics: [['ডেটা টাইপ, অপারেটর ও কন্ডিশন', 90], ['লুপ ও অ্যারে', 90], ['ফাংশন', 70]] },
          { title: '৬ষ্ঠ অধ্যায়: ডেটাবেজ ম্যানেজমেন্ট সিস্টেম', mcq: 4, topics: [['DBMS, রিলেশন ও কী', 85], ['SQL ও কুয়েরি', 80]] },
        ],
      },
    ],
  },

  // ── COMMON / LANGUAGE (all groups) ──────────────────────────────────────────
  {
    id: 'bangla1',
    title: 'বাংলা ১ম পত্র',
    short: 'Bangla 1st',
    icon: '📖',
    groups: { science: 10, business: 10, humanities: 1 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'গদ্য',
        minCq: 3,
        availCq: 4,
        chapters: [
          { title: 'অপরিচিতা — রবীন্দ্রনাথ ঠাকুর', mcq: 3, topics: [['অনুপম ও কল্যাণীর চরিত্র', 90], ['যৌতুক প্রথা ও নারী জাগরণ', 75]] },
          { title: 'বিলাসী — শরৎচন্দ্র চট্টোপাধ্যায়', mcq: 2, topics: [['মৃত্যুঞ্জয় ও বিলাসীর আত্মত্যাগ', 80], ['সমাজ ও কুসংস্কার', 65]] },
          { title: 'আমার পথ — কাজী নজরুল ইসলাম', mcq: 2, topics: [['আত্মনির্ভরতা ও সত্য প্রকাশ', 75]] },
          { title: 'মানব-কল্যাণ — আবুল ফজল', mcq: 2, topics: [['মানবকল্যাণের প্রকৃত রূপ', 70]] },
          { title: 'মাসি-পিসি — মানিক বন্দ্যোপাধ্যায়', mcq: 2, topics: [['আহ্লাদি ও নারীর সংগ্রাম', 70]] },
          { title: 'বায়ান্নর দিনগুলো — শেখ মুজিবুর রহমান', mcq: 2, topics: [['ভাষা আন্দোলন ও কারাজীবন', 75]] },
        ],
      },
      {
        title: 'পদ্য',
        minCq: 3,
        availCq: 4,
        chapters: [
          { title: 'বিদ্রোহী — কাজী নজরুল ইসলাম', mcq: 3, topics: [['বিদ্রোহী চেতনা ও পুরাণ-উপমা', 90]] },
          { title: 'সোনার তরী — রবীন্দ্রনাথ ঠাকুর', mcq: 2, topics: [['রূপক ও জীবনদর্শন', 85]] },
          { title: 'তাহারেই পড়ে মনে — সুফিয়া কামাল', mcq: 2, topics: [['বিরহ ও ঋতুচেতনা', 70]] },
          { title: 'আঠারো বছর বয়স — সুকান্ত ভট্টাচার্য', mcq: 2, topics: [['তারুণ্যের শক্তি ও দ্বন্দ্ব', 75]] },
          { title: 'আমি কিংবদন্তির কথা বলছি — আবু জাফর ওবায়দুল্লাহ', mcq: 2, topics: [['মাটি ও মানুষের ইতিহাস', 65]] },
        ],
      },
      {
        title: 'উপন্যাস ও নাটক',
        minCq: 1,
        availCq: 3,
        chapters: [
          { title: 'লালসালু (উপন্যাস) — সৈয়দ ওয়ালীউল্লাহ', mcq: 3, topics: [['মজিদ চরিত্র ও ধর্মব্যবসা', 85], ['কুসংস্কার ও মহব্বতনগর', 70]] },
          { title: 'সিরাজউদ্দৌলা (নাটক) — সিকান্দার আবু জাফর', mcq: 3, topics: [['সিরাজ চরিত্র ও দেশপ্রেম', 85], ['ষড়যন্ত্র ও পলাশীর যুদ্ধ', 70]] },
        ],
      },
    ],
  },
  {
    id: 'bangla2',
    title: 'বাংলা ২য় পত্র',
    short: 'Bangla 2nd',
    icon: '✍️',
    groups: { science: 11, business: 11, humanities: 2 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'ব্যাকরণ',
        minCq: 3,
        availCq: 5,
        chapters: [
          { title: 'সন্ধি', mcq: 5, topics: [['স্বরসন্ধি ও ব্যঞ্জনসন্ধি', 85], ['নিপাতনে সিদ্ধ সন্ধি', 65]] },
          { title: 'সমাস', mcq: 5, topics: [['দ্বন্দ্ব, তৎপুরুষ ও বহুব্রীহি সমাস', 90], ['কর্মধারয় ও দ্বিগু সমাস', 70]] },
          { title: 'কারক ও বিভক্তি', mcq: 5, topics: [['কারক নির্ণয়', 90], ['বিভক্তি ও অনুসর্গ', 70]] },
          { title: 'প্রকৃতি ও প্রত্যয়', mcq: 4, topics: [['কৃৎ ও তদ্ধিত প্রত্যয়', 80]] },
          { title: 'বানান ও বাক্যশুদ্ধি', mcq: 5, topics: [['বাংলা বানানের নিয়ম', 85], ['বাক্য শুদ্ধিকরণ', 70]] },
          { title: 'পদ প্রকরণ', mcq: 3, topics: [['পদ চিনে নির্ণয়', 70]] },
          { title: 'বাগধারা ও বাক্য সংকোচন', mcq: 3, topics: [['বাগধারার অর্থ', 75], ['এক কথায় প্রকাশ', 70]] },
        ],
      },
      {
        title: 'নির্মিতি',
        minCq: 4,
        availCq: 6,
        chapters: [
          { title: 'সারাংশ ও সারমর্ম', mcq: 0, topics: [['সারাংশ লিখন', 80], ['সারমর্ম লিখন', 75]] },
          { title: 'ভাবসম্প্রসারণ', mcq: 0, topics: [['ভাব ও তাৎপর্য বিশ্লেষণ', 80]] },
          { title: 'পত্র ও দরখাস্ত', mcq: 0, topics: [['আবেদনপত্র ও মানপত্র', 75], ['ব্যক্তিগত ও ব্যবহারিক পত্র', 65]] },
          { title: 'প্রতিবেদন রচনা', mcq: 0, topics: [['সংবাদ ও ঘটনা প্রতিবেদন', 80]] },
          { title: 'সংলাপ ও খুদে গল্প', mcq: 0, topics: [['সংলাপ রচনা', 65], ['খুদে গল্প', 60]] },
          { title: 'প্রবন্ধ রচনা', mcq: 0, topics: [['বিষয়ভিত্তিক প্রবন্ধ', 85]] },
        ],
      },
    ],
  },
  {
    id: 'english1',
    title: 'English 1st Paper',
    short: 'English 1st',
    icon: '🔤',
    groups: { science: 12, business: 12, humanities: 3 },
    marks: { cq: 0, mcq: 0, sq: 100, sqVal: 1 },
    sections: [
      {
        title: 'Part A — Reading (60)',
        minCq: 0,
        availCq: 0,
        chapters: [
          { title: 'Seen Comprehension — MCQ & Q&A', sq: 15, topics: [['MCQ from passage', 90], ['Open-ended questions (answer in own words)', 85]] },
          { title: 'Information Transfer / Flow Chart', sq: 10, topics: [['Filling charts & tables', 80]] },
          { title: 'Summary Writing', sq: 10, topics: [['Writing a summary of the passage', 80]] },
          { title: 'Cloze Test (with & without clues)', sq: 10, topics: [['Gap filling with clues', 80], ['Gap filling without clues', 75]] },
          { title: 'Rearranging & Matching', sq: 15, topics: [['Rearranging sentences into a story', 80], ['Matching to make meaning', 70]] },
        ],
      },
      {
        title: 'Part B — Writing (40)',
        minCq: 0,
        availCq: 0,
        chapters: [
          { title: 'Paragraph Writing', sq: 10, topics: [['Paragraph (cause-effect / listing)', 85]] },
          { title: 'Completing a Story', sq: 10, topics: [['Completing the story with moral', 80]] },
          { title: 'Informal Email / Letter', sq: 10, topics: [['Email to a friend', 80]] },
          { title: 'Describing Graph / Chart / Process', sq: 10, topics: [['Graph & chart description', 75]] },
        ],
      },
    ],
  },
  {
    id: 'english2',
    title: 'English 2nd Paper',
    short: 'English 2nd',
    icon: '📝',
    groups: { science: 13, business: 13, humanities: 4 },
    marks: { cq: 0, mcq: 0, sq: 100, sqVal: 1 },
    sections: [
      {
        title: 'Part A — Grammar (60)',
        minCq: 0,
        availCq: 0,
        chapters: [
          { title: 'Articles & Prepositions', sq: 10, topics: [['Gap filling with articles', 85], ['Prepositions in context', 85]] },
          { title: 'Right Form of Verbs', sq: 10, topics: [['Tense & verb agreement', 90]] },
          { title: 'Narration', sq: 7, topics: [['Direct to indirect speech', 80]] },
          { title: 'Transformation of Sentences', sq: 7, topics: [['Simple / complex / compound', 80]] },
          { title: 'Completing Sentences', sq: 7, topics: [['Using clauses & phrases', 75]] },
          { title: 'Modifiers & Connectors', sq: 9, topics: [['Use of modifiers', 75], ['Sentence connectors', 75]] },
          { title: 'Synonym / Antonym & Punctuation', sq: 10, topics: [['Word meaning in context', 65], ['Punctuation & capitalization', 70]] },
        ],
      },
      {
        title: 'Part B — Composition (40)',
        minCq: 0,
        availCq: 0,
        chapters: [
          { title: 'CV with Cover Letter / Application', sq: 10, topics: [['Job application & CV', 80]] },
          { title: 'Paragraph Writing', sq: 10, topics: [['Descriptive / argumentative paragraph', 80]] },
          { title: 'Report Writing', sq: 10, topics: [['Newspaper / event report', 80]] },
          { title: 'Composition / Essay', sq: 10, topics: [['Essay on common topics', 80]] },
        ],
      },
    ],
  },

  // ── BUSINESS STUDIES ────────────────────────────────────────────────────────
  {
    id: 'acc1',
    title: 'হিসাববিজ্ঞান ১ম পত্র',
    short: 'Accounting 1st',
    icon: '🧾',
    groups: { business: 1 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: হিসাববিজ্ঞান পরিচিতি', mcq: 3, topics: [['হিসাববিজ্ঞানের উদ্দেশ্য ও পরিধি', 65]] },
          { title: '২য় অধ্যায়: দুতরফা দাখিলা পদ্ধতি', mcq: 3, topics: [['ডেবিট-ক্রেডিট ও হিসাব সমীকরণ', 80]] },
          { title: '৩য় অধ্যায়: লেনদেন', mcq: 3, topics: [['লেনদেনের বৈশিষ্ট্য ও শ্রেণিবিভাগ', 70]] },
          { title: '৪র্থ অধ্যায়: জাবেদা', mcq: 4, topics: [['সাধারণ জাবেদা', 90], ['বিশেষ জাবেদা', 70]] },
          { title: '৫ম অধ্যায়: খতিয়ান', mcq: 3, topics: [['খতিয়ান প্রস্তুত ও জের নির্ণয়', 85]] },
          { title: '৬ষ্ঠ অধ্যায়: নগদান বই', mcq: 4, topics: [['তিনঘরা নগদান বই', 85], ['খুচরা নগদান বই', 60]] },
          { title: '৭ম অধ্যায়: রেওয়ামিল', mcq: 4, topics: [['রেওয়ামিল প্রস্তুত ও ভুল সংশোধন', 90]] },
          { title: '৮ম অধ্যায়: প্রাপ্য ও প্রদেয় বিল', mcq: 3, topics: [['বিল বাট্টাকরণ ও অসম্মান', 70]] },
          { title: '৯ম অধ্যায়: ব্যাংক সমন্বয় বিবরণী', mcq: 3, topics: [['ব্যাংক সমন্বয় বিবরণী প্রস্তুত', 85]] },
        ],
      },
    ],
  },
  {
    id: 'acc2',
    title: 'হিসাববিজ্ঞান ২য় পত্র',
    short: 'Accounting 2nd',
    icon: '📒',
    groups: { business: 2 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: আর্থিক বিবরণী', mcq: 5, topics: [['আয় বিবরণী ও উদ্বৃত্তপত্র', 95], ['সমন্বয় দাখিলা', 85]] },
          { title: '২য় অধ্যায়: কুঋণ, প্রাপ্য হিসাব ও সঞ্চিতি', mcq: 3, topics: [['কুঋণ ও কুঋণ সঞ্চিতি', 75]] },
          { title: '৩য় অধ্যায়: অবচয়', mcq: 4, topics: [['সরলরৈখিক ও ক্রমহ্রাসমান পদ্ধতি', 85], ['সম্পদ বিক্রয় ও বিনিময়', 65]] },
          { title: '৪র্থ অধ্যায়: প্রাপ্য ও প্রদেয় বিল', mcq: 3, topics: [['বিল হিসাবভুক্তকরণ', 70]] },
          { title: '৫ম অধ্যায়: অংশীদারি কারবারের হিসাব', mcq: 4, topics: [['মুনাফা বণ্টন ও চলতি হিসাব', 85]] },
          { title: '৬ষ্ঠ অধ্যায়: যৌথমূলধনী কোম্পানির মূলধন', mcq: 4, topics: [['শেয়ার ইস্যু ও বাজেয়াপ্তকরণ', 85]] },
          { title: '৭ম অধ্যায়: উৎপাদন ব্যয় হিসাব', mcq: 4, topics: [['উৎপাদন ব্যয় বিবরণী', 80]] },
          { title: '৮ম অধ্যায়: আর্থিক বিবরণী বিশ্লেষণ (অনুপাত)', mcq: 3, topics: [['তারল্য ও মুনাফা অনুপাত', 80]] },
        ],
      },
    ],
  },
  {
    id: 'fin1',
    title: 'ফিন্যান্স, ব্যাংকিং ও বিমা ১ম পত্র',
    short: 'Finance 1st',
    icon: '🏦',
    groups: { business: 3 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: অর্থায়নের সূচনা', mcq: 3, topics: [['অর্থায়নের লক্ষ্য, নীতি ও পরিধি', 70]] },
          { title: '২য় অধ্যায়: আর্থিক বিবরণী ও অনুপাত বিশ্লেষণ', mcq: 4, topics: [['অনুপাত বিশ্লেষণ', 80]] },
          { title: '৩য় অধ্যায়: অর্থের সময়মূল্য', mcq: 5, topics: [['বর্তমান ও ভবিষ্যৎ মূল্য', 95], ['বার্ষিক বৃত্তি (Annuity)', 85]] },
          { title: '৪র্থ অধ্যায়: মূলধন বাজেটিং ও বিনিয়োগ সিদ্ধান্ত', mcq: 5, topics: [['NPV ও IRR', 90], ['পরিশোধকাল ও লাভ-ক্ষতি সূচক', 70]] },
          { title: '৫ম অধ্যায়: মূলধন ব্যয়', mcq: 4, topics: [['ভারিত গড় মূলধন ব্যয় (WACC)', 85]] },
          { title: '৬ষ্ঠ অধ্যায়: ঝুঁকি ও মুনাফার হার', mcq: 3, topics: [['ঝুঁকি পরিমাপ ও বৈচিত্র্যায়ন', 75]] },
          { title: '৭ম অধ্যায়: স্বল্পমেয়াদি অর্থায়ন', mcq: 3, topics: [['উৎস ও কার্যকরী মূলধন', 65]] },
          { title: '৮ম অধ্যায়: দীর্ঘমেয়াদি অর্থায়ন', mcq: 3, topics: [['শেয়ার, ঋণপত্র ও লিজিং', 65]] },
        ],
      },
    ],
  },
  {
    id: 'bom',
    title: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা',
    short: 'Business Org. & Mgmt',
    icon: '🏢',
    groups: { business: 4 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: ব্যবসায় পরিচিতি', mcq: 3, topics: [['ব্যবসায়ের ধারণা ও পরিবেশ', 65]] },
          { title: '২য় অধ্যায়: ব্যবসায়ের আইনগত দিক', mcq: 3, topics: [['ট্রেড লাইসেন্স, পেটেন্ট ও ট্রেডমার্ক', 65]] },
          { title: '৩য় অধ্যায়: একমালিকানা ব্যবসায়', mcq: 3, topics: [['বৈশিষ্ট্য, সুবিধা ও অসুবিধা', 70]] },
          { title: '৪র্থ অধ্যায়: অংশীদারি ব্যবসায়', mcq: 4, topics: [['অংশীদারি চুক্তি ও প্রকারভেদ', 85]] },
          { title: '৫ম অধ্যায়: যৌথমূলধনী ব্যবসায় (কোম্পানি)', mcq: 5, topics: [['কোম্পানি গঠন ও দলিল', 90], ['শেয়ার, ঋণপত্র ও সভা', 70]] },
          { title: '৬ষ্ঠ অধ্যায়: সমবায় ও রাষ্ট্রীয় ব্যবসায়', mcq: 3, topics: [['সমবায় সমিতির নীতি', 65]] },
          { title: '৭ম অধ্যায়: ব্যবস্থাপনার ধারণা ও নীতি', mcq: 4, topics: [['ফেয়লের নীতি ও টেইলরের মতবাদ', 85]] },
          { title: '৮ম অধ্যায়: পরিকল্পনা, সংগঠিতকরণ ও নেতৃত্ব', mcq: 5, topics: [['সংগঠন কাঠামো ও কর্তৃত্ব অর্পণ', 80], ['নেতৃত্ব ও প্রেষণা তত্ত্ব (Maslow)', 85]] },
        ],
      },
    ],
  },
  {
    id: 'econ',
    title: 'অর্থনীতি',
    short: 'Economics',
    icon: '📈',
    groups: { business: 5, humanities: 5 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: অর্থনীতির মৌলিক ধারণা', mcq: 3, topics: [['মৌলিক সমস্যা ও উৎপাদন সম্ভাবনা রেখা', 75]] },
          { title: '২য় অধ্যায়: চাহিদা, যোগান ও ভারসাম্য', mcq: 5, topics: [['চাহিদা বিধি ও স্থিতিস্থাপকতা', 95], ['ভারসাম্য দাম নির্ধারণ', 80]] },
          { title: '৩য় অধ্যায়: উৎপাদন ও উৎপাদন ব্যয়', mcq: 4, topics: [['উৎপাদন অপেক্ষক ও ক্রমহ্রাসমান প্রান্তিক বিধি', 85]] },
          { title: '৪র্থ অধ্যায়: বাজার ও দাম নির্ধারণ', mcq: 4, topics: [['পূর্ণ প্রতিযোগিতা ও একচেটিয়া বাজার', 80]] },
          { title: '৫ম অধ্যায়: উৎপাদনের উপাদান ও বণ্টন', mcq: 3, topics: [['খাজনা, মজুরি, সুদ ও মুনাফা', 70]] },
          { title: '৬ষ্ঠ অধ্যায়: জাতীয় আয় ও এর পরিমাপ', mcq: 4, topics: [['GDP ও GNP গণনা', 85]] },
          { title: '৭ম অধ্যায়: মুদ্রা, ব্যাংক ও মুদ্রাস্ফীতি', mcq: 4, topics: [['ব্যাংকের কার্যাবলি ও মুদ্রাস্ফীতি', 75]] },
          { title: '৮ম অধ্যায়: বাংলাদেশের অর্থনীতি', mcq: 3, topics: [['কৃষি, শিল্প ও খাত বিশ্লেষণ', 60]] },
        ],
      },
    ],
  },

  // ── HUMANITIES ──────────────────────────────────────────────────────────────
  {
    id: 'civics',
    title: 'পৌরনীতি ও সুশাসন',
    short: 'Civics & Good Governance',
    icon: '⚖️',
    groups: { humanities: 6 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: পৌরনীতি ও সুশাসন পরিচিতি', mcq: 4, topics: [['সুশাসনের উপাদান ও গুরুত্ব', 85]] },
          { title: '২য় অধ্যায়: নাগরিক ও নাগরিকতা', mcq: 4, topics: [['নাগরিকের অধিকার ও কর্তব্য', 80]] },
          { title: '৩য় অধ্যায়: রাষ্ট্র ও সরকার', mcq: 5, topics: [['রাষ্ট্রের উপাদান ও সার্বভৌমত্ব', 80], ['গণতন্ত্র ও স্বৈরতন্ত্র', 70]] },
          { title: '৪র্থ অধ্যায়: সরকারের অঙ্গ ও বিভাগ', mcq: 4, topics: [['আইন, শাসন ও বিচার বিভাগ', 80]] },
          { title: '৫ম অধ্যায়: আইন, স্বাধীনতা ও সাম্য', mcq: 4, topics: [['আইনের উৎস ও শ্রেণিবিভাগ', 75]] },
          { title: '৬ষ্ঠ অধ্যায়: নির্বাচন, জনমত ও রাজনৈতিক দল', mcq: 4, topics: [['নির্বাচন কমিশন ও ভোটাধিকার', 75]] },
          { title: '৭ম অধ্যায়: সংবিধান ও সাংবিধানিক প্রতিষ্ঠান', mcq: 3, topics: [['বাংলাদেশের সংবিধানের বৈশিষ্ট্য', 85]] },
          { title: '৮ম অধ্যায়: সুশাসন ও ই-গভর্ন্যান্স', mcq: 2, topics: [['ই-গভর্ন্যান্স ও জবাবদিহিতা', 65]] },
        ],
      },
    ],
  },
  {
    id: 'logic',
    title: 'যুক্তিবিদ্যা',
    short: 'Logic',
    icon: '🧠',
    groups: { humanities: 7 },
    marks: { cq: 70, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 7,
        availCq: 11,
        chapters: [
          { title: '১ম অধ্যায়: যুক্তিবিদ্যার স্বরূপ', mcq: 3, topics: [['যুক্তিবিদ্যার সংজ্ঞা, পরিধি ও প্রকৃতি', 70]] },
          { title: '২য় অধ্যায়: যুক্তিবিদ্যা ও অন্যান্য বিষয়', mcq: 2, topics: [['যুক্তিবিদ্যা ও দর্শন/বিজ্ঞানের সম্পর্ক', 55]] },
          { title: '৩য় অধ্যায়: পদ', mcq: 4, topics: [['পদের ব্যক্ত্যর্থ ও জাত্যর্থ', 80], ['পদের শ্রেণিবিভাগ', 65]] },
          { title: '৪র্থ অধ্যায়: যুক্তিবাক্য', mcq: 4, topics: [['যুক্তিবাক্যের শ্রেণিবিভাগ ও বিন্যাস', 85]] },
          { title: '৫ম অধ্যায়: অমাধ্যম অনুমান', mcq: 5, topics: [['আবর্তন ও প্রতিবর্তন', 90], ['বিরোধানুমান', 70]] },
          { title: '৬ষ্ঠ অধ্যায়: মাধ্যম অনুমান (ন্যায়)', mcq: 5, topics: [['ন্যায়ের আকার ও বিধি', 90], ['বৈধতা যাচাই', 75]] },
          { title: '৭ম অধ্যায়: আরোহ অনুমান ও কারণ', mcq: 4, topics: [['কারণ ও মিলের পদ্ধতি', 80]] },
          { title: '৮ম অধ্যায়: অনুপপত্তি', mcq: 3, topics: [['অবৈধ সামান্যীকরণ ও আকারগত অনুপপত্তি', 65]] },
        ],
      },
    ],
  },
]

// ── Expansion: RAW authoring format → fully-typed nested objects ──────────────

function buildSeed(): SubjectWithSyllabus[] {
  return RAW.map((rs) => {
    const subject: SubjectWithSyllabus = {
      id: rs.id,
      title: rs.title,
      short_code: rs.short,
      icon_emoji: rs.icon,
      is_active: true,
      rank_science: rs.groups.science ?? null,
      rank_business: rs.groups.business ?? null,
      rank_humanities: rs.groups.humanities ?? null,
      max_cq: rs.marks.cq,
      max_mcq: rs.marks.mcq,
      max_sq: rs.marks.sq ?? 0,
      cq_value_per_q: rs.marks.cqVal ?? 10,
      sq_value_per_q: rs.marks.sqVal ?? 2,
      sections: rs.sections.map((sec, si) => {
        const sectionId = `${rs.id}-s${si + 1}`
        return {
          id: sectionId,
          subject_id: rs.id,
          title: sec.title,
          min_cq_required: sec.minCq ?? 0,
          total_cq_available: sec.availCq ?? 0,
          sort_order: si,
          chapters: sec.chapters.map((chap, ci) => {
            const chapterId = `${sectionId}-c${ci + 1}`
            return {
              id: chapterId,
              section_id: sectionId,
              title: chap.title,
              est_mcq: chap.mcq ?? 0,
              est_sq: chap.sq ?? 0,
              sort_order: ci,
              topics: chap.topics.map((t, ti) => ({
                id: `${chapterId}-t${ti + 1}`,
                chapter_id: chapterId,
                title: t[0],
                weight: t[1],
                sort_order: ti,
              })),
            }
          }),
        }
      }),
    }
    return subject
  })
}

export const SEED_SUBJECTS: SubjectWithSyllabus[] = buildSeed()

export function seedSubjectList(): Subject[] {
  return SEED_SUBJECTS.map(({ sections: _sections, ...rest }) => rest)
}
