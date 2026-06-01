import type { GroupKey, Subject, SubjectWithSyllabus } from './types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HSC 2026 — STARTER SUGGESTION CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  This is a *scaffold*. Chapter/topic names follow the standard HSC syllabus,
 *  but every `weight` (topic importance, 0–100) and the mark distributions are
 *  PLACEHOLDERS chosen for plausibility. Review and replace them with real
 *  suggestion data via the Admin panel before going live.
 *
 *  In local-demo mode this data backs the whole app. With Supabase configured,
 *  it is ignored (the DB is the source of truth) — see supabase/seed.sql for the
 *  same content as SQL.
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
        title: 'A বিভাগ — যান্ত্রিকবিদ্যা',
        minCq: 3,
        availCq: 5,
        chapters: [
          { title: 'ভৌত জগৎ ও পরিমাপ', mcq: 2, sq: 0, topics: [['মাত্রা ও একক', 75], ['পরিমাপের ত্রুটি ও স্লাইড ক্যালিপার্স', 55], ['মাত্রিক সমীকরণ', 60]] },
          { title: 'ভেক্টর', mcq: 3, sq: 1, topics: [['ভেক্টরের যোগ ও বিয়োজন', 80], ['স্কেলার ও ভেক্টর গুণন', 85], ['লব্ধি ও উপাংশ', 70]] },
          { title: 'গতিবিদ্যা', mcq: 3, sq: 1, topics: [['প্রাসের গতি (Projectile)', 90], ['গতির সমীকরণ', 70], ['আপেক্ষিক বেগ', 50]] },
          { title: 'নিউটনিয়ান বলবিদ্যা', mcq: 3, sq: 1, topics: [['নিউটনের সূত্র ও ভরবেগ', 85], ['ঘর্ষণ', 60], ['কেন্দ্রমুখী বল', 65]] },
          { title: 'কাজ, শক্তি ও ক্ষমতা', mcq: 2, sq: 1, topics: [['কাজ-শক্তি উপপাদ্য', 80], ['সংরক্ষণশীল বল ও বিভব শক্তি', 65], ['ক্ষমতা ও দক্ষতা', 55]] },
        ],
      },
      {
        title: 'B বিভাগ — পদার্থের ধর্ম ও পর্যাবৃত্ত গতি',
        minCq: 2,
        availCq: 5,
        chapters: [
          { title: 'মহাকর্ষ ও অভিকর্ষ', mcq: 2, sq: 1, topics: [['কেপলারের সূত্র', 70], ['মহাকর্ষীয় বিভব ও মুক্তি বেগ', 80], ['g এর তারতম্য', 60]] },
          { title: 'পদার্থের গাঠনিক ধর্ম', mcq: 3, sq: 1, topics: [['পীড়ন, বিকৃতি ও ইয়ং গুণাঙ্ক', 85], ['পৃষ্ঠটান ও সান্দ্রতা', 65], ['স্থিতিস্থাপকতা', 55]] },
          { title: 'পর্যাবৃত্ত গতি', mcq: 3, sq: 1, topics: [['সরল ছন্দিত স্পন্দন (SHM)', 90], ['সরল দোলক', 70], ['শক্তির রূপান্তর', 50]] },
          { title: 'আদর্শ গ্যাস ও গ্যাসের গতিতত্ত্ব', mcq: 2, sq: 0, topics: [['গ্যাসের সূত্রাবলি', 70], ['গতিতত্ত্ব ও মূল গড় বর্গবেগ', 65], ['গড় গতিশক্তি', 45]] },
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
        title: 'A বিভাগ — তাপ ও তড়িৎ',
        minCq: 3,
        availCq: 5,
        chapters: [
          { title: 'তাপগতিবিদ্যা', mcq: 3, sq: 1, topics: [['তাপগতিবিদ্যার সূত্র', 85], ['কার্নো চক্র ও এনট্রপি', 70]] },
          { title: 'স্থির তড়িৎ', mcq: 3, sq: 1, topics: [['কুলম্বের সূত্র ও তড়িৎ ক্ষেত্র', 80], ['ধারক ও ধারকত্ব', 75]] },
          { title: 'চল তড়িৎ', mcq: 3, sq: 1, topics: [['ওহমের সূত্র ও রোধের সমন্বয়', 80], ['কির্শফের সূত্র ও হুইটস্টোন ব্রিজ', 85]] },
          { title: 'তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব', mcq: 3, sq: 1, topics: [['বায়োট-স্যাভার্ট ও অ্যাম্পিয়ারের সূত্র', 75], ['চৌম্বক ক্ষেত্রে গতিশীল আধান', 65]] },
        ],
      },
      {
        title: 'B বিভাগ — আলো ও আধুনিক পদার্থবিজ্ঞান',
        minCq: 2,
        availCq: 5,
        chapters: [
          { title: 'তাড়িতচৌম্বকীয় আবেশ ও পরিবর্তী প্রবাহ', mcq: 2, sq: 1, topics: [['ফ্যারাডে ও লেঞ্জের সূত্র', 80], ['AC ও RMS মান', 60]] },
          { title: 'জ্যামিতিক আলোকবিজ্ঞান', mcq: 2, sq: 1, topics: [['লেন্স ও দর্পণ সমীকরণ', 75], ['প্রতিসরণ ও মোট অভ্যন্তরীণ প্রতিফলন', 70]] },
          { title: 'ভৌত আলোকবিজ্ঞান', mcq: 2, sq: 0, topics: [['ব্যতিচার ও অপবর্তন', 70], ['সমবর্তন', 50]] },
          { title: 'আধুনিক পদার্থবিজ্ঞান', mcq: 3, sq: 1, topics: [['আপেক্ষিকতা', 65], ['ফটোতড়িৎ ক্রিয়া', 85]] },
          { title: 'সেমিকন্ডাক্টর ও ইলেকট্রনিক্স', mcq: 3, sq: 1, topics: [['p-n জাংশন ও ডায়োড', 75], ['ট্রানজিস্টর ও লজিক গেইট', 70]] },
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
        availCq: 5,
        chapters: [
          { title: 'ল্যাবরেটরির নিরাপদ ব্যবহার', mcq: 2, sq: 0, topics: [['রাসায়নিক দ্রব্যের সংরক্ষণ', 55], ['দুর্ঘটনা ও প্রাথমিক চিকিৎসা', 45]] },
          { title: 'গুণগত রসায়ন', mcq: 5, sq: 2, topics: [['বোর মডেল ও কোয়ান্টাম সংখ্যা', 85], ['ইলেকট্রন বিন্যাস', 80], ['শিখা পরীক্ষা ও সনাক্তকরণ', 70]] },
          { title: 'মৌলের পর্যায়বৃত্ত ধর্ম ও রাসায়নিক বন্ধন', mcq: 5, sq: 2, topics: [['পর্যায়বৃত্ত ধর্ম', 80], ['সংকরায়ন ও আকৃতি', 90], ['বন্ধন ও পোলারিটি', 70]] },
          { title: 'রাসায়নিক পরিবর্তন', mcq: 5, sq: 2, topics: [['রাসায়নিক সাম্যাবস্থা ও Kc/Kp', 90], ['সাম্যাবস্থায় লা-শাতেলিয়ার নীতি', 80], ['বিক্রিয়ার হার', 65]] },
          { title: 'কর্মমুখী রসায়ন', mcq: 3, sq: 1, topics: [['খাদ্য সংরক্ষণ ও তেল-চর্বি', 60], ['ধাতু নিষ্কাশন', 55]] },
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
        availCq: 5,
        chapters: [
          { title: 'পরিবেশ রসায়ন', mcq: 3, sq: 1, topics: [['বায়ুমণ্ডল ও দূষণ', 60], ['গ্যাসীয় অবস্থা ও সূত্র', 75]] },
          { title: 'জৈব রসায়ন', mcq: 6, sq: 2, topics: [['হাইড্রোকার্বন ও কার্যকরী মূলক', 90], ['বিক্রিয়া কৌশল ও সমাণুতা', 85], ['অ্যালকোহল-অ্যালডিহাইড-অ্যাসিড', 80]] },
          { title: 'পরিমাণগত রসায়ন', mcq: 5, sq: 2, topics: [['মোলারিটি ও টাইট্রেশন', 90], ['গ্যাসীয় আয়তন গণনা', 70]] },
          { title: 'তড়িৎ রসায়ন', mcq: 4, sq: 1, topics: [['গ্যালভানিক কোষ ও তড়িৎদ্বার বিভব', 80], ['তড়িৎ বিশ্লেষণ ও ফ্যারাডের সূত্র', 75]] },
          { title: 'অর্থনৈতিক রসায়ন', mcq: 2, sq: 0, topics: [['শিল্পে উৎপাদন (অ্যামোনিয়া, সালফিউরিক এসিড)', 55]] },
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
        title: 'বীজগণিত ও জ্যামিতি',
        minCq: 3,
        availCq: 5,
        chapters: [
          { title: 'ম্যাট্রিক্স ও নির্ণায়ক', mcq: 3, sq: 1, topics: [['নির্ণায়কের ধর্ম', 80], ['বিপরীত ম্যাট্রিক্স ও সমীকরণ সমাধান', 85]] },
          { title: 'ভেক্টর', mcq: 2, sq: 1, topics: [['স্কেলার ও ভেক্টর গুণন', 80], ['ভেক্টরের প্রয়োগ', 60]] },
          { title: 'সরলরেখা', mcq: 3, sq: 1, topics: [['রেখার সমীকরণ ও ঢাল', 75], ['দুই রেখার অন্তর্ভুক্ত কোণ', 65]] },
          { title: 'বৃত্ত', mcq: 3, sq: 1, topics: [['বৃত্তের সাধারণ সমীকরণ', 80], ['স্পর্শক ও জ্যা', 70]] },
        ],
      },
      {
        title: 'ক্যালকুলাস ও ত্রিকোণমিতি',
        minCq: 2,
        availCq: 5,
        chapters: [
          { title: 'বিন্যাস ও সমাবেশ', mcq: 3, sq: 1, topics: [['বিন্যাস (nPr)', 70], ['সমাবেশ (nCr)', 75]] },
          { title: 'ত্রিকোণমিতিক অনুপাত ও সংযুক্ত কোণ', mcq: 3, sq: 1, topics: [['যোগ-বিয়োগ সূত্র', 75], ['একাধিক কোণের অনুপাত', 70]] },
          { title: 'অন্তরীকরণ', mcq: 4, sq: 2, topics: [['অন্তরজের সূত্রাবলি', 90], ['সর্বোচ্চ-সর্বনিম্ন মান', 85], ['স্পর্শক ও অভিলম্ব', 65]] },
          { title: 'যোগজীকরণ', mcq: 4, sq: 2, topics: [['মৌলিক যোগজ', 85], ['নির্দিষ্ট যোগজ ও ক্ষেত্রফল', 80]] },
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
        availCq: 5,
        chapters: [
          { title: 'জটিল সংখ্যা', mcq: 3, sq: 1, topics: [['মডুলাস ও আর্গুমেন্ট', 75], ['ঘনমূল ও De Moivre', 70]] },
          { title: 'বহুপদী ও বহুপদী সমীকরণ', mcq: 3, sq: 1, topics: [['মূল ও সহগের সম্পর্ক', 80]] },
          { title: 'দ্বিপদী বিস্তৃতি', mcq: 3, sq: 1, topics: [['সাধারণ পদ ও নির্দিষ্ট পদ', 85]] },
          { title: 'কনিক', mcq: 4, sq: 2, topics: [['পরাবৃত্ত (Parabola)', 80], ['উপবৃত্ত ও অধিবৃত্ত', 75]] },
          { title: 'বিপরীত ত্রিকোণমিতিক ফাংশন ও সমীকরণ', mcq: 3, sq: 1, topics: [['ত্রিকোণমিতিক সমীকরণের সাধারণ সমাধান', 80]] },
          { title: 'স্থিতিবিদ্যা', mcq: 3, sq: 1, topics: [['লামির উপপাদ্য ও বলের সাম্য', 70]] },
          { title: 'বিস্তার পরিমাপ ও সম্ভাবনা', mcq: 4, sq: 2, topics: [['পরিমিত ব্যবধান', 75], ['সম্ভাবনার যোগ ও গুণ বিধি', 80]] },
        ],
      },
    ],
  },
  {
    id: 'bio1',
    title: 'জীববিজ্ঞান ১ম পত্র (উদ্ভিদ)',
    short: 'Biology 1st',
    icon: '🌿',
    groups: { science: 7 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 5,
        chapters: [
          { title: 'কোষ ও এর গঠন', mcq: 3, sq: 1, topics: [['প্লাজমা মেমব্রেন ও মাইটোকন্ড্রিয়া', 80], ['প্লাস্টিড ও নিউক্লিয়াস', 70]] },
          { title: 'কোষ বিভাজন', mcq: 4, sq: 2, topics: [['মাইটোসিস', 85], ['মিয়োসিস', 90]] },
          { title: 'কোষ রসায়ন', mcq: 3, sq: 1, topics: [['কার্বোহাইড্রেট ও প্রোটিন', 70], ['এনজাইম', 65]] },
          { title: 'অণুজীব', mcq: 3, sq: 1, topics: [['ভাইরাস', 75], ['ব্যাকটেরিয়া', 70]] },
          { title: 'টিস্যু ও টিস্যুতন্ত্র', mcq: 3, sq: 1, topics: [['ভাজক ও স্থায়ী টিস্যু', 70]] },
          { title: 'উদ্ভিদ শারীরতত্ত্ব', mcq: 4, sq: 2, topics: [['সালোকসংশ্লেষণ', 90], ['শ্বসন', 80], ['প্রস্বেদন', 60]] },
          { title: 'জীবপ্রযুক্তি', mcq: 3, sq: 1, topics: [['টিস্যু কালচার ও রিকম্বিন্যান্ট DNA', 75]] },
        ],
      },
    ],
  },
  {
    id: 'bio2',
    title: 'জীববিজ্ঞান ২য় পত্র (প্রাণী)',
    short: 'Biology 2nd',
    icon: '🐾',
    groups: { science: 8 },
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 5,
        chapters: [
          { title: 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', mcq: 3, sq: 1, topics: [['পর্ব ও বৈশিষ্ট্য', 75]] },
          { title: 'প্রাণীর পরিচিতি (ঘাসফড়িং, রুই মাছ)', mcq: 4, sq: 2, topics: [['ঘাসফড়িং', 80], ['রুই মাছ', 75]] },
          { title: 'পরিপাক ও শোষণ', mcq: 3, sq: 1, topics: [['পরিপাকতন্ত্র ও এনজাইম', 75]] },
          { title: 'রক্ত ও সঞ্চালন', mcq: 4, sq: 2, topics: [['হৃৎপিণ্ড ও কার্ডিয়াক চক্র', 90], ['রক্তের উপাদান', 70]] },
          { title: 'শ্বসন ও শ্বাসক্রিয়া', mcq: 3, sq: 1, topics: [['শ্বসনতন্ত্র ও গ্যাস বিনিময়', 75]] },
          { title: 'সমন্বয় ও নিয়ন্ত্রণ', mcq: 3, sq: 1, topics: [['নিউরন ও স্নায়ু সঞ্চালন', 80]] },
          { title: 'জিনতত্ত্ব ও বিবর্তন', mcq: 4, sq: 2, topics: [['মেন্ডেলের সূত্র', 90], ['রক্তের গ্রুপ ও সেক্স লিংকড', 75]] },
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
          { title: 'বিশ্ব ও বাংলাদেশ প্রেক্ষিত', mcq: 3, sq: 1, topics: [['বায়োমেট্রিক্স ও বায়োইনফরমেট্রিক্স', 70], ['ভার্চুয়াল রিয়েলিটি ও রোবোটিক্স', 65], ['ন্যানোটেকনোলজি ও জেনেটিক ইঞ্জিনিয়ারিং', 60]] },
          { title: 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', mcq: 4, sq: 2, topics: [['ডেটা ট্রান্সমিশন মোড ও মিডিয়া', 80], ['নেটওয়ার্ক টপোলজি', 85], ['ক্লাউড ও মোবাইল প্রজন্ম', 60]] },
          { title: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', mcq: 5, sq: 2, topics: [['সংখ্যা পদ্ধতি রূপান্তর', 90], ['লজিক গেইট ও বুলিয়ান অ্যালজেবরা', 90], ['অ্যাডার ও এনকোডার/ডিকোডার', 70]] },
          { title: 'ওয়েব ডিজাইন ও HTML', mcq: 4, sq: 2, topics: [['HTML ট্যাগ ও টেবিল', 85], ['হাইপারলিংক ও ইমেজ', 70]] },
          { title: 'প্রোগ্রামিং ভাষা (C)', mcq: 5, sq: 2, topics: [['ডেটা টাইপ ও অপারেটর', 80], ['লুপ ও কন্ডিশন', 90], ['অ্যারে ও ফাংশন', 70]] },
          { title: 'ডেটাবেজ ম্যানেজমেন্ট সিস্টেম', mcq: 4, sq: 2, topics: [['DBMS ও রিলেশন', 80], ['SQL ও কুয়েরি', 75]] },
        ],
      },
    ],
  },

  // ── COMMON (all groups) ─────────────────────────────────────────────────────
  {
    id: 'bangla1',
    title: 'বাংলা ১ম পত্র',
    short: 'Bangla 1st',
    icon: '📖',
    groups: { science: 10, business: 10, humanities: 1 },
    marks: { cq: 50, mcq: 30, cqVal: 10 },
    sections: [
      {
        title: 'গদ্য',
        minCq: 2,
        availCq: 4,
        chapters: [
          { title: 'অপরিচিতা — রবীন্দ্রনাথ ঠাকুর', mcq: 2, sq: 1, topics: [['অনুপম ও কল্যাণীর চরিত্র', 85], ['যৌতুক প্রথা', 70]] },
          { title: 'বিলাসী — শরৎচন্দ্র চট্টোপাধ্যায়', mcq: 2, sq: 1, topics: [['মৃত্যুঞ্জয় ও বিলাসী', 80], ['সমাজ ও কুসংস্কার', 65]] },
          { title: 'আমার পথ — কাজী নজরুল ইসলাম', mcq: 1, sq: 1, topics: [['আত্মনির্ভরতা ও সত্য', 75]] },
        ],
      },
      {
        title: 'পদ্য',
        minCq: 2,
        availCq: 4,
        chapters: [
          { title: 'বিদ্রোহী — কাজী নজরুল ইসলাম', mcq: 2, sq: 1, topics: [['বিদ্রোহী চেতনা', 85]] },
          { title: 'সোনার তরী — রবীন্দ্রনাথ ঠাকুর', mcq: 2, sq: 1, topics: [['রূপক ও জীবনদর্শন', 80]] },
          { title: 'তাহারেই পড়ে মনে — সুফিয়া কামাল', mcq: 1, sq: 1, topics: [['বিরহ ও প্রকৃতি', 65]] },
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
    marks: { cq: 30, mcq: 30, sq: 40, cqVal: 5, sqVal: 1 },
    sections: [
      {
        title: 'ব্যাকরণ ও নির্মিতি',
        minCq: 5,
        availCq: 6,
        chapters: [
          { title: 'ব্যাকরণিক শব্দশ্রেণি ও বানান', mcq: 6, sq: 4, topics: [['বাংলা বানানের নিয়ম', 85], ['পদ প্রকরণ', 75], ['ণত্ব ও ষত্ব বিধান', 60]] },
          { title: 'বাক্য ও প্রয়োগ', mcq: 5, sq: 4, topics: [['বাক্য সংকোচন ও বাগধারা', 80], ['সমাস ও সন্ধি', 75], ['কারক ও বিভক্তি', 70]] },
          { title: 'নির্মিতি (রচনা ও পত্র)', mcq: 0, sq: 0, topics: [['প্রবন্ধ রচনা', 80], ['সারমর্ম ও সারাংশ', 70], ['দরখাস্ত ও প্রতিবেদন', 65]] },
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
        title: 'Seen & Unseen',
        minCq: 0,
        availCq: 0,
        chapters: [
          { title: 'Seen Comprehension (Units)', mcq: 0, sq: 30, topics: [['MCQ & Q&A from text', 85], ['Information transfer / Flow chart', 70]] },
          { title: 'Unseen / Cloze Test', mcq: 0, sq: 25, topics: [['Cloze test (with & without clues)', 80], ['Rearranging & Summarizing', 70]] },
          { title: 'Writing', mcq: 0, sq: 45, topics: [['Paragraph', 80], ['Story / Completing story', 70], ['Email & Graph description', 65]] },
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
        title: 'Grammar & Composition',
        minCq: 0,
        availCq: 0,
        chapters: [
          { title: 'Grammar', mcq: 0, sq: 60, topics: [['Right form of verbs', 85], ['Preposition & Articles', 80], ['Transformation & Narration', 75], ['Modifiers & Connectors', 70]] },
          { title: 'Composition', mcq: 0, sq: 40, topics: [['Application & CV', 80], ['Paragraph & Essay', 75], ['Report writing', 65]] },
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
        availCq: 8,
        chapters: [
          { title: 'হিসাববিজ্ঞান পরিচিতি', mcq: 3, sq: 1, topics: [['হিসাববিজ্ঞানের উদ্দেশ্য ও পরিধি', 60]] },
          { title: 'লেনদেন', mcq: 3, sq: 1, topics: [['লেনদেনের বৈশিষ্ট্য', 70], ['দুতরফা দাখিলা', 80]] },
          { title: 'হিসাবের বইসমূহ — জাবেদা', mcq: 4, sq: 2, topics: [['সাধারণ জাবেদা', 85], ['বিশেষ জাবেদা', 75]] },
          { title: 'খতিয়ান', mcq: 3, sq: 2, topics: [['খতিয়ান প্রস্তুত ও জের নির্ণয়', 85]] },
          { title: 'নগদান বই', mcq: 3, sq: 2, topics: [['তিন ঘরা নগদান বই', 80], ['ব্যাংক সমন্বয় বিবরণী', 85]] },
          { title: 'রেওয়ামিল', mcq: 3, sq: 2, topics: [['রেওয়ামিল প্রস্তুত ও ভুল সংশোধন', 90]] },
          { title: 'হিসাববিজ্ঞানের নীতিমালা ও কার্যপ্রণালী', mcq: 3, sq: 1, topics: [['হিসাবচক্র', 65]] },
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
        availCq: 8,
        chapters: [
          { title: 'আর্থিক বিবরণী', mcq: 4, sq: 2, topics: [['আয় বিবরণী ও উদ্বৃত্তপত্র', 90], ['সমন্বয় দাখিলা', 85]] },
          { title: 'কু-ঋণ ও প্রাপ্য বিল', mcq: 3, sq: 1, topics: [['প্রাপ্য হিসাব ও কু-ঋণ সঞ্চিতি', 75]] },
          { title: 'অবচয়', mcq: 4, sq: 2, topics: [['সরল রৈখিক ও ক্রমহ্রাসমান পদ্ধতি', 85]] },
          { title: 'যৌথ মূলধনী কোম্পানির মূলধন', mcq: 4, sq: 2, topics: [['শেয়ার ইস্যু ও বাজেয়াপ্তকরণ', 80]] },
          { title: 'উৎপাদন ব্যয় হিসাব', mcq: 3, sq: 1, topics: [['উৎপাদন ব্যয় বিবরণী', 80]] },
          { title: 'আর্থিক বিবরণী বিশ্লেষণ (অনুপাত)', mcq: 3, sq: 1, topics: [['তারল্য ও মুনাফা অনুপাত', 75]] },
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
        availCq: 8,
        chapters: [
          { title: 'অর্থায়নের সূচনা', mcq: 3, sq: 1, topics: [['অর্থায়নের লক্ষ্য ও নীতি', 65]] },
          { title: 'অর্থের সময়মূল্য', mcq: 4, sq: 2, topics: [['বর্তমান ও ভবিষ্যৎ মূল্য', 90], ['বার্ষিক বৃত্তি (Annuity)', 80]] },
          { title: 'ঝুঁকি ও মুনাফার হার', mcq: 3, sq: 1, topics: [['ঝুঁকি পরিমাপ ও বৈচিত্র্যায়ন', 75]] },
          { title: 'মূলধন বাজেটিং', mcq: 4, sq: 2, topics: [['NPV ও IRR', 85], ['পরিশোধকাল', 70]] },
          { title: 'মূলধন ব্যয়', mcq: 3, sq: 1, topics: [['ভারিত গড় মূলধন ব্যয় (WACC)', 80]] },
          { title: 'স্বল্প ও দীর্ঘমেয়াদি অর্থায়ন', mcq: 3, sq: 1, topics: [['উৎস ও বৈশিষ্ট্য', 60]] },
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
        availCq: 8,
        chapters: [
          { title: 'ব্যবসায় পরিচিতি', mcq: 3, sq: 1, topics: [['ব্যবসায়ের পরিবেশ', 65]] },
          { title: 'একমালিকানা ও অংশীদারি কারবার', mcq: 4, sq: 2, topics: [['অংশীদারি চুক্তি ও বৈশিষ্ট্য', 80]] },
          { title: 'যৌথ মূলধনী ব্যবসায়', mcq: 4, sq: 2, topics: [['কোম্পানি গঠন ও দলিল', 85]] },
          { title: 'ব্যবস্থাপনার ধারণা ও নীতি', mcq: 3, sq: 1, topics: [['ফেয়লের নীতি', 75]] },
          { title: 'পরিকল্পনা ও সংগঠিতকরণ', mcq: 3, sq: 2, topics: [['সংগঠন কাঠামো', 70]] },
          { title: 'নেতৃত্ব ও প্রেষণা', mcq: 3, sq: 1, topics: [['প্রেষণা তত্ত্ব (Maslow)', 80]] },
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
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'ব্যষ্টিক ও সামষ্টিক অর্থনীতি',
        minCq: 5,
        availCq: 6,
        chapters: [
          { title: 'মৌলিক অর্থনৈতিক সমস্যা', mcq: 3, sq: 1, topics: [['উৎপাদন সম্ভাবনা রেখা', 70]] },
          { title: 'চাহিদা, যোগান ও ভারসাম্য', mcq: 4, sq: 2, topics: [['চাহিদা বিধি ও স্থিতিস্থাপকতা', 90], ['ভারসাম্য দাম নির্ধারণ', 80]] },
          { title: 'উৎপাদন ও উৎপাদন ব্যয়', mcq: 3, sq: 2, topics: [['উৎপাদন অপেক্ষক ও বিধি', 80]] },
          { title: 'বাজার', mcq: 3, sq: 1, topics: [['পূর্ণ প্রতিযোগিতা ও একচেটিয়া বাজার', 75]] },
          { title: 'জাতীয় আয় ও এর পরিমাপ', mcq: 3, sq: 1, topics: [['GDP ও GNP গণনা', 80]] },
          { title: 'বাংলাদেশের অর্থনীতি', mcq: 3, sq: 1, topics: [['কৃষি ও শিল্প খাত', 60]] },
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
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 6,
        chapters: [
          { title: 'পৌরনীতি ও সুশাসন পরিচিতি', mcq: 3, sq: 1, topics: [['সুশাসনের উপাদান', 80]] },
          { title: 'নাগরিকতা', mcq: 3, sq: 1, topics: [['নাগরিকের অধিকার ও কর্তব্য', 75]] },
          { title: 'রাষ্ট্র ও সরকার', mcq: 4, sq: 2, topics: [['সরকারের অঙ্গসমূহ', 80], ['গণতন্ত্র ও স্বৈরতন্ত্র', 70]] },
          { title: 'আইন, স্বাধীনতা ও সাম্য', mcq: 3, sq: 1, topics: [['আইনের উৎস ও শ্রেণিবিভাগ', 70]] },
          { title: 'নির্বাচন ও জনমত', mcq: 3, sq: 1, topics: [['নির্বাচন কমিশন ও ভোটাধিকার', 70]] },
          { title: 'সংবিধান', mcq: 3, sq: 1, topics: [['বাংলাদেশের সংবিধানের বৈশিষ্ট্য', 80]] },
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
    marks: { cq: 50, mcq: 25, cqVal: 10 },
    sections: [
      {
        title: 'পূর্ণাঙ্গ সিলেবাস',
        minCq: 5,
        availCq: 6,
        chapters: [
          { title: 'যুক্তিবিদ্যার স্বরূপ', mcq: 3, sq: 1, topics: [['যুক্তিবিদ্যার সংজ্ঞা ও পরিধি', 65]] },
          { title: 'পদ ও যুক্তিবাক্য', mcq: 4, sq: 2, topics: [['পদের ব্যক্ত্যর্থ ও জাত্যর্থ', 75], ['যুক্তিবাক্যের শ্রেণিবিভাগ', 80]] },
          { title: 'অমাধ্যম ও মাধ্যম অনুমান', mcq: 4, sq: 2, topics: [['আবর্তন ও প্রতিবর্তন', 85], ['ন্যায় অনুমান', 80]] },
          { title: 'আরোহ অনুমান', mcq: 3, sq: 1, topics: [['কারণ ও মিলের পদ্ধতি', 75]] },
          { title: 'অনুমান-সম্পর্কিত অনুপপত্তি', mcq: 3, sq: 1, topics: [['অবৈধ সামান্যীকরণ', 60]] },
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
