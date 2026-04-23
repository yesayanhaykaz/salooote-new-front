"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { productsAPI, vendorsAPI } from "@/lib/api";
import {
  Heart, PartyPopper, Users, Sparkles, Star, Gift,
  Cake, Flower2, Baby, TreePine, Smile, ShoppingBag,
  ChevronRight, ArrowLeft,
} from "lucide-react";

const EVENT_META = {
  balloons: {
    label: "Balloons & Decor",
    labelHy: "Փուչիկներ և Ձևավորում",
    labelRu: "Шары и Оформление",
    desc: "Find top balloon decoration professionals for your event.",
    descHy: "Գտե՛ք փուչիկներով ձևավորման լավագույն մասնագետներին Ձեր միջոցառման համար։",
    descRu: "Найдите лучших специалистов по оформлению воздушными шарами для вашего мероприятия.",
    about: {
      hy: "Salooote հարթակում կարող եք գտնել փուչիկներով ձևավորման լավագույն մասնագետներին՝ Ձեր միջոցառումը յուրահատուկ դարձնելու համար։\n\nՄեր գործընկերները ձևավորում են հոբելյաններ, մկրտություններ, ծննդյան տոներ, ատամհատիքներ և կորպորատիվ միջոցառումներ՝ անհատական դիզայնով՝ ըստ Ձեր նախասիրության։\n\nԿարող եք ընտրել պատրաստի տարբերակներից կամ կապ հաստատել մասնագետների հետ՝ Ձեր գաղափարը կյանքի կոչելու համար։ Բացի փուչիկներից՝ հասանելի են նաև տարբեր դեկորներ և միջոցառման համար անհրաժեշտ այլ պարագաներ։",
      en: "On Salooote, you can find top balloon decoration professionals to make your event truly special.\n\nOur vendors offer custom-designed decorations for birthdays, baptisms, anniversaries, tooth parties, and corporate events — tailored to your preferences.\n\nBrowse ready-made designs or connect directly with vendors to bring your own ideas to life. In addition to balloons, you'll also find event decor and all the accessories you need.",
      ru: "На платформе Salooote вы найдёте лучших специалистов по оформлению воздушными шарами для создания незабываемой атмосферы.\n\nНаши партнёры оформляют юбилеи, крещения, дни рождения и корпоративные мероприятия с индивидуальным подходом к каждому клиенту.\n\nВыберите готовый дизайн или свяжитесь с исполнителями, чтобы воплотить свою идею. Помимо шаров, доступны декор и другие необходимые аксессуары.",
    },
    icon: Sparkles,
    gradient: "from-pink-400 via-rose-400 to-fuchsia-400",
    keywords: ["balloon", "decor", "balloons", "ձևավորում", "փուչիկ"],
    suggestedCats: ["balloons", "decor", "gifts"],
    checklist: ["Choose decoration style", "Pick a color theme", "Order balloons & decor", "Arrange delivery/setup", "Book photographer"],
  },
  cakes: {
    label: "Cakes & Pastry",
    labelHy: "Տորթեր",
    labelRu: "Торты",
    desc: "Order beautiful custom cakes for any occasion from the best pastry vendors.",
    descHy: "Պատվիրե՛ք գեղեցիկ տոնական տորթեր ամենատարբեր առիթների համար Հայաստանի լավագույն հրուշակագործներից։",
    descRu: "Заказывайте красивые праздничные торты для любого повода у лучших кондитеров Армении.",
    about: {
      hy: "Salooote-ում կարող եք պատվիրել տոնական տորթեր լավագույն հրուշակագործներից՝ ըստ Ձեր նախասիրության։\n\nՀարթակում ներկայացված են մանկական, մրգային, թեմատիկ և անհատական դիզայնով տորթեր ամենատարբեր առիթների համար՝ լինի ծննդյան տոն, մկրտություն, ատամհատիկ թե հոբելյան։\n\nԿարող եք ընտրել մատակարարի տեսականուց կամ պատվիրել տորթ Ձեր նախընտրած դիզայնով՝ ընտրելով նաև միջուկի բաղադրությունը։ Պատվերներն ընդունվում են 2-3 օր առաջ և առաքվում են Երևանում և ամբողջ Հայաստանում։",
      en: "On Salooote, you can order cakes from the best pastry vendors in Armenia, tailored to your taste.\n\nBrowse children's cakes, fruit cakes, themed designs, and fully custom creations for any occasion — be it a birthday, baptism, tooth party, or anniversary.\n\nChoose from vendor portfolios or request a personalized cake with your preferred design and filling. Orders are accepted 2–3 days in advance and delivered across Yerevan and Armenia.",
      ru: "На Salooote вы можете заказать торты у лучших кондитеров Армении по вашему вкусу.\n\nПредставлены детские, фруктовые, тематические и полностью индивидуальные торты для любого повода — дня рождения, крещения, праздника первого зубика или юбилея.\n\nВыберите из готового ассортимента или закажите торт по вашему дизайну с нужной начинкой. Заказы принимаются за 2–3 дня и доставляются по Еревану и всей Армении.",
    },
    icon: Cake,
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    keywords: ["cake", "tort", "pastry", "տորթ", "торт"],
    suggestedCats: ["cakes-desserts", "gifts"],
    checklist: ["Choose cake design", "Select filling", "Decide on size & portions", "Order 2–3 days ahead", "Arrange delivery"],
  },
  "cartoon-characters": {
    label: "Cartoon Characters",
    labelHy: "Մուլտֆիլմերի Հերոսներ",
    labelRu: "Герои Мультфильмов",
    desc: "Bring magic to your child's party with favorite cartoon characters.",
    descHy: "Կյանքի կոչե՛ք հեքիաթն ու ժամանցի անմոռանալի ծրագիր կազմակերպե՛ք Ձեր երեխայի տոնի համար։",
    descRu: "Подарите ребёнку сказку и организуйте незабываемую программу с героями мультфильмов.",
    about: {
      hy: "Salooote հարթակում կարող եք գտնել մուլտֆիլմերի հերոսների ծառայություններ մատուցող մասնագետներ, ովքեր կդարձնեն մանկական տոները ավելի ուրախ ու հիշարժան։\n\nԵրեխաները բոլոր տարիքներում սիրում են մուլտֆիլմեր և երազում հանդիպել իրենց սիրելի հերոսների հետ։ Ընտրե՛ք Ձեր երեխայի սիրելի կերպարները և պատվիրե՛ք անմոռանալի ժամանցային ծրագիր։\n\nՀարթակի մատակարարները առաջարկում են տարբեր ոճեր, սցենարներ և խաղային ծրագրեր ամեն տարիքի երեխաների համար։ Նախքան պատվիրելը պարզե՛ք, թե ով է Ձեր երեխայի սիրելի մուլտհերոսը։",
      en: "Find cartoon character entertainment professionals on Salooote and make your child's party truly magical.\n\nChildren of all ages adore cartoons and dream of meeting their favorite characters in person. Choose your child's favorite character and book an unforgettable entertainment program.\n\nVendors on the platform offer a variety of characters, custom scripts, and interactive programs for children of all ages. Before booking, find out who your child's favorite character is!",
      ru: "Найдите на Salooote специалистов по развлечениям с героями мультфильмов и сделайте праздник ребёнка по-настоящему волшебным.\n\nДети всех возрастов обожают мультфильмы и мечтают встретить любимых персонажей. Выберите любимого героя вашего ребёнка и закажите незабываемую развлекательную программу.\n\nПоставщики платформы предлагают разнообразных персонажей, сценарии и интерактивные программы для детей любого возраста. Перед заказом узнайте, кто является любимым героем вашего ребёнка!",
    },
    icon: Smile,
    gradient: "from-violet-400 via-purple-400 to-indigo-400",
    keywords: ["cartoon", "character", "kids", "animation", "մուլտ", "мульт"],
    suggestedCats: ["entertainment", "cakes-desserts", "balloons"],
    checklist: ["Find out child's favorite character", "Book animator/performer", "Plan entertainment program", "Order themed cake", "Get matching decor"],
  },
  gifts: {
    label: "Gifts",
    labelHy: "Նվերներ",
    labelRu: "Подарки",
    desc: "Discover unique and original gifts for any occasion and any person.",
    descHy: "Գտե՛ք օրիգինալ ու յուրահատուկ նվերներ ցանկացած տարիքի, սեռի և առիթի համար։",
    descRu: "Найдите оригинальные и уникальные подарки для любого возраста, пола и случая.",
    about: {
      hy: "Salooote-ում կարող եք գտնել օրիգինալ և յուրահատուկ նվերներ տարբեր վաճառողներից։\n\nՀարթակում ներկայացված են նվերների լայն ընտրանի ցանկացած տարիքի, սեռի և առիթի համար։ Բոլոր ապրանքները կարող են ունենալ գեղեցիկ փաթեթավորում և անհատական մոտեցում, որպեսզի Ձեր նվերն անմոռանալի լինի։\n\nՀետաքրքիր ու յուրահատուկ նվերներ Ձեր մտերիմների համար — Salooote-ում կգտնեք այն, ինչ փնտրում եք։",
      en: "Discover unique and original gifts from multiple vendors on Salooote.\n\nBrowse a wide range of gift ideas for all ages, genders, and occasions. Many products come with premium packaging and personal customization options to make your gift truly unforgettable.\n\nFind the perfect gift for your loved ones — Salooote has everything you're looking for.",
      ru: "Откройте для себя оригинальные и уникальные подарки от разных продавцов на Salooote.\n\nШирокий выбор идей для любого возраста, пола и случая. Многие товары доступны с подарочной упаковкой и возможностью персонализации, чтобы ваш подарок остался незабываемым.\n\nНайдите идеальный подарок для своих близких — на Salooote вы найдёте то, что ищете.",
    },
    icon: Gift,
    gradient: "from-teal-400 via-cyan-400 to-sky-400",
    keywords: ["gift", "present", "нвер", "նвер", "подарок"],
    suggestedCats: ["gifts", "cakes-desserts"],
    checklist: ["Choose recipient & occasion", "Set your budget", "Pick the gift", "Add personalized packaging", "Arrange delivery"],
  },
  romantic: {
    label: "Romantic & Proposals",
    labelHy: "Ռոմանտիկ և Սիրո Խոստովանություն",
    labelRu: "Романтика и Предложения",
    desc: "Create an unforgettable romantic moment with the help of our vendors.",
    descHy: "Ստեղծե՛ք անմոռանալի ռոմանտիկ պահ Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Создайте незабываемый романтический момент с помощью специалистов на Salooote.",
    about: {
      hy: "Salooote-ում կարող եք գտնել ռոմանտիկ ձևավորումների և սիրո խոստովանությունների կազմակերպման մասնագետներ։\n\nԴուք ուզում եք, որ ամեն ինչ կատարյալ լինի։ Ուզում եք, որ Ձեր փոխարեն խոսեն գեղեցիկ իրերը՝ մոմերը, ծաղիկները, փուչիկները, ֆոտոզոնաները… Salooote-ի մատակարարները կօգնեն Ձեզ այդ հարցում։\n\nՍտեղծե՛ք անմոռանալի պահ՝ ընտրելով պատրաստի սցենար կամ ձևակերպելով Ձեր սեփական գաղափարը մատակարարների հետ։ Ծաղիկներ, մոմեր, փուչիկներ, ֆոտոզոնաներ — ամեն ինչ Ձեր ցանկության համաձայն։",
      en: "Find professionals for romantic setups and proposals on Salooote.\n\nYou want everything to be perfect. You want the flowers, candles, balloons, and photo zones to speak for you — and Salooote vendors are here to make that happen.\n\nCreate an unforgettable moment by choosing a ready-made concept or working with vendors to design your own unique experience. Flowers, candles, balloons, photo zones — everything tailored to your wishes.",
      ru: "Найдите на Salooote специалистов по романтическим оформлениям и предложениям руки и сердца.\n\nВы хотите, чтобы всё было идеально. Чтобы вместо вас говорили красивые вещи — свечи, цветы, шары, фотозоны. Специалисты Salooote помогут вам в этом.\n\nСоздайте незабываемый момент, выбрав готовый сценарий или разработав уникальную идею вместе с исполнителями. Цветы, свечи, шары, фотозоны — всё по вашему желанию.",
    },
    icon: Heart,
    gradient: "from-red-400 via-rose-500 to-pink-500",
    keywords: ["romantic", "proposal", "love", "valentine", "ռոমանտիկ", "романтик"],
    suggestedCats: ["balloons", "gifts", "flowers"],
    checklist: ["Choose the moment & venue", "Plan the surprise", "Order flowers", "Set up candles & decor", "Book photographer"],
  },
  baptism: {
    label: "Baptism",
    labelHy: "Մկրտություն",
    labelRu: "Крещение",
    desc: "Make your child's baptism ceremony as beautiful and memorable as possible.",
    descHy: "Կյանքի ամենակարևոր արարողություններից մեկն անմոռանալի դարձրե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Сделайте одно из самых важных таинств жизни незабываемым с помощью специалистов Salooote.",
    about: {
      hy: "Կնունքի արարողությունն ամենակարևոր ու հիշարժան պահերից է Ձեր ընտանիքի կյանքում։\n\nSalooote-ում կարող եք գտնել փորձառու մասնագետներ, ովքեր կօգնեն ձևավորել այս հատուկ օրը ամենագեղեցիկ ձևով։ Նման արարողություններին պատրաստվելը պահանջում է ժամանակ, ջանք ու ուշադրություն — Salooote-ի գործընկերները պատրաստ են ստանձնել այդ բոլոր հոգսերը։\n\nԸնտրե՛ք ձևավորման ոճ, պատվիրե՛ք տորթ, նվերներ կամ այլ անհրաժեշտ ծառայություններ Salooote-ի մատակարարներից։",
      en: "A baptism is one of the most important and memorable moments in your family's life.\n\nOn Salooote, you can find experienced professionals who will help make this special day as beautiful as possible. Preparing for such a ceremony takes time, effort, and care — Salooote vendors are ready to take on all of that for you.\n\nChoose a decoration style, order a cake, gifts, or any other services you need from Salooote vendors.",
      ru: "Крещение — один из самых важных и памятных моментов в жизни вашей семьи.\n\nНа Salooote вы найдёте опытных специалистов, которые помогут сделать этот особый день максимально красивым. Подготовка к такому торжеству требует времени, сил и внимания — партнёры Salooote готовы взять все эти заботы на себя.\n\nВыберите стиль оформления, закажите торт, подарки или другие необходимые услуги у поставщиков Salooote.",
    },
    icon: Baby,
    gradient: "from-sky-300 via-blue-400 to-indigo-400",
    keywords: ["baptism", "christening", "baby", "մкрտություն", "крещение"],
    suggestedCats: ["balloons", "cakes-desserts", "gifts"],
    checklist: ["Book the ceremony", "Choose decoration style", "Order baptism cake", "Prepare gifts", "Arrange catering/reception"],
  },
  "baby-tooth": {
    label: "Tooth Party",
    labelHy: "Ատամհատիկ",
    labelRu: "Праздник Первого Зубика",
    desc: "Celebrate your little one's first tooth with a beautifully organized party.",
    descHy: "Ձեր փոքրիկի ատամհատիկն անմոռանալի դարձրե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Сделайте праздник первого зубика вашего малыша незабываемым с помощью Salooote.",
    about: {
      hy: "Ձեր փոքրիկն արդեն ատամ է հանե՞լ։ Ատամհատիկը հատուկ առիթ է, որ արժե նշել գեղեցիկ ու անմոռանալի կերպով։\n\nՇատերն ինքնուրույն կազմակերպում են ատամհատիքը, ոմանք էլ նախընտրում են վստահել ավելի փորձառուներին — կա՛մ ժամանակի, կա՛մ անթերի արդյունքի ցանկության պատճառով։\n\nSalooote-ում կարող եք գտնել ատամհատիկի ձևավորման մասնագետներ, տորթ պատվիրել, ընտրել անհրաժեշտ պարագաներ և կազմակերպել ամբողջ տոնը մեկ հարթակում։",
      en: "Has your little one cut their first tooth? A tooth party is a special occasion worth celebrating beautifully.\n\nSome parents organize it themselves, while others prefer to entrust the planning to experienced professionals — either for lack of time or to ensure everything is perfect.\n\nOn Salooote, you can find tooth party decoration specialists, order a cake, choose all the necessary supplies, and plan the entire celebration in one platform.",
      ru: "Ваш малыш уже прорезал первый зубик? Праздник первого зубика — особый повод, который стоит отметить красиво и незабываемо.\n\nОдни родители организуют его самостоятельно, другие предпочитают доверить подготовку опытным специалистам — из-за нехватки времени или желания, чтобы всё было идеально.\n\nНа Salooote вы найдёте специалистов по оформлению, закажете торт, выберете нужные аксессуары и организуете весь праздник на одной платформе.",
    },
    icon: Baby,
    gradient: "from-lime-400 via-green-400 to-emerald-400",
    keywords: ["baby", "tooth", "ատամ", "зуб", "atam"],
    suggestedCats: ["cakes-desserts", "balloons", "gifts"],
    checklist: ["Pick a theme & color", "Order tooth party cake", "Get balloons & decor", "Prepare profession items", "Invite family & friends"],
  },
  christmas: {
    label: "New Year & Christmas",
    labelHy: "Ամանոր և Սուրբ Ծնունդ",
    labelRu: "Новый Год и Рождество",
    desc: "Create the perfect festive atmosphere for New Year and Christmas.",
    descHy: "Ամանորն ու Սուրբ Ծնունդն անմոռանալի դարձրե՛ք Salooote-ի լավագույն մատակարարների շնորհիվ։",
    descRu: "Сделайте Новый год и Рождество незабываемыми с лучшими поставщиками на Salooote.",
    about: {
      hy: "Ամանորը մոտենում է, և Salooote-ը կօգնի Ձեզ կատարյալ դարձնել տոնական մթնոլորտը։\n\nՀարկ է ճիշտ նվեր ընտրել, ձևավորել տունն ու միջոցառումը, պատվիրել տոնական տորթ — հարցեր, որոնք հուզում են գրեթե բոլորին։ Salooote-ի մատակարարները պատրաստ են կատարյալ ամանորյա մթնոլորտ ստեղծել Ձեզ համար։\n\nՀարթակում կարող եք գտնել ամանորյա ձևավորման մատակարարներ, ընտրել օրիգինալ ամանորյա նվերներ, նվերների տուփեր և բոլոր անհրաժեշտ պարագաները Ձեր տոնի համար։",
      en: "The New Year is approaching, and Salooote is here to help you create the perfect festive atmosphere.\n\nChoosing the right gift, decorating your home, ordering a festive cake — these are questions that concern almost everyone. Salooote vendors are ready to create a perfect New Year atmosphere for you.\n\nFind Christmas decoration vendors, choose original New Year gifts, gift boxes, and everything you need for a magical celebration.",
      ru: "Новый год приближается, и Salooote поможет вам создать идеальную праздничную атмосферу.\n\nВыбрать правильный подарок, украсить дом, заказать праздничный торт — вопросы, которые волнуют почти каждого. Поставщики Salooote готовы создать для вас идеальную новогоднюю атмосферу.\n\nНайдите поставщиков новогодних украшений, выберите оригинальные подарки, подарочные коробки и всё необходимое для волшебного праздника.",
    },
    icon: TreePine,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    keywords: ["christmas", "new year", "ամանոր", "Новый год", "новогод"],
    suggestedCats: ["gifts", "cakes-desserts", "balloons"],
    checklist: ["Plan the decoration theme", "Order New Year gifts", "Book festive cake", "Get Christmas decor", "Arrange entertainment"],
  },
  wedding: {
    label: "Weddings",
    labelHy: "Հարսանիքներ",
    labelRu: "Свадьбы",
    desc: "Everything you need to make your wedding day absolutely perfect.",
    descHy: "Ձեր հարսանյաց օրն անմոռանալի դարձնելու համար անհրաժեշտ ամեն ինչ Salooote-ում։",
    descRu: "Всё необходимое для того, чтобы ваш свадебный день был идеальным — на Salooote.",
    about: {
      hy: "Հարսանիքն Ձեր կյանքի ամենակարևոր ու հիշարժան օրերից է։ Salooote-ում կարող եք գտնել լավագույն մատակարարներ Ձեր հարսանյաց բոլոր կարիքների համար։\n\nԾաղիկներ, տորթ, սննդի մատուցում, ֆոտոգրաֆ, երաժշտություն — ամեն ինչ Salooote-ի հարթակում մեկ տեղում։ Համեմատե՛ք, ընտրե՛ք, կազմակերպե՛ք Ձեր կատարյալ հարսանիքը հեշտ ու արագ։",
      en: "Your wedding day is one of the most important and memorable days of your life. On Salooote, you can find the best vendors for all your wedding needs.\n\nFlowers, cakes, catering, photography, music — all in one place on the Salooote platform. Compare, choose, and plan your perfect wedding easily and quickly.",
      ru: "Свадьба — один из самых важных и незабываемых дней в вашей жизни. На Salooote вы найдёте лучших поставщиков для всех свадебных нужд.\n\nЦветы, торты, кейтеринг, фотография, музыка — всё в одном месте на платформе Salooote. Сравнивайте, выбирайте и организовывайте идеальную свадьбу легко и быстро.",
    },
    icon: Heart,
    gradient: "from-pink-500 via-rose-500 to-red-400",
    keywords: ["wedding", "bride", "cake", "flowers", "catering", "ring"],
    suggestedCats: ["cakes", "flowers", "catering", "music", "photography"],
    checklist: ["Book venue", "Order wedding cake", "Hire florist", "Book catering", "Find photographer", "Book DJ/Band", "Arrange transport", "Order invitations"],
  },
  birthday: {
    label: "Birthdays",
    labelHy: "Ծննդյան Տոններ",
    labelRu: "Дни Рождения",
    desc: "Celebrate every birthday in style with the best vendors in Armenia.",
    descHy: "Ծննդյան տոնն ամենաանմոռանալի ձևով կազմակերպե՛ք Salooote-ի լավագույն մատակարարների հետ։",
    descRu: "Организуйте день рождения самым незабываемым образом с лучшими поставщиками на Salooote.",
    about: {
      hy: "Ծննդյան տոնը հատուկ օր է, որ արժե նշել հեքիաթային ձևով — թե՛ փոքրի, թե՛ մեծի համար։\n\nSalooote-ում կարող եք գտնել լավագույն մատակարարներ ծննդյան տոնի բոլոր կարիքների համար՝ գունագեղ փուչիկներ, թեմատիկ ձևավորում, մոմեր, լույսեր, տորթ, ժամանցային ծրագիր և ամեն ինչ, ինչ կանեք Ձեր կատարյալ ծննդյան տոնը։\n\nԿազմակերպե՛ք Ձեր կամ Ձեր սիրելիի ծննդյան տոնն հեշտ ու արագ՝ մեկ հարթակում։",
      en: "A birthday is a special day worth celebrating in the most magical way — for kids and adults alike.\n\nOn Salooote, you can find the best vendors for all birthday needs: colorful balloons, themed decorations, candles, lights, cakes, entertainment, and everything else that makes your birthday perfect.\n\nPlan your own or your loved one's birthday easily and quickly in one platform.",
      ru: "День рождения — особый день, который стоит отмечать самым волшебным образом — и для детей, и для взрослых.\n\nНа Salooote вы найдёте лучших поставщиков для всех потребностей дня рождения: красочные шары, тематическое оформление, свечи, огни, торты, развлечения и всё остальное для идеального праздника.\n\nОрганизуйте свой или чужой день рождения легко и быстро на одной платформе.",
    },
    icon: PartyPopper,
    gradient: "from-blue-400 via-cyan-500 to-sky-400",
    keywords: ["birthday", "party", "cake", "balloons", "kids"],
    suggestedCats: ["cakes", "balloons", "catering", "music"],
    checklist: ["Order birthday cake", "Get balloons & decor", "Book catering", "Arrange entertainment", "Send invitations"],
  },
  corporate: {
    label: "Corporate Events",
    labelHy: "Կորպորատիվ Միջոցառումներ",
    labelRu: "Корпоративные Мероприятия",
    desc: "Impress your clients and team with a professionally organized corporate event.",
    descHy: "Ձեր կորպորատիվ միջոցառումն անթերի կազմակերպե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Организуйте безупречное корпоративное мероприятие с помощью поставщиков Salooote.",
    about: {
      hy: "Salooote-ում կարող եք գտնել կորպորատիվ միջոցառումների կազմակերպման բոլոր ծառայությունները մեկ հարթակում։\n\nՍննդի մատուցում, ձևավորում, ժամանցային ծրագրեր, ֆոտոգրաֆ — ամեն ինչ, ինչ անհրաժեշտ է Ձեր կամ Ձեր ընկերության միջոցառման համար։ Համեմատե՛ք, ընտրե՛ք, կազմակերպե՛ք։",
      en: "On Salooote, you can find all the services for organizing corporate events in one platform.\n\nCatering, decoration, entertainment programs, photography — everything your company event needs. Compare vendors, choose the best, and organize effortlessly.",
      ru: "На Salooote вы найдёте все услуги для организации корпоративных мероприятий на одной платформе.\n\nКейтеринг, оформление, развлекательные программы, фотография — всё необходимое для вашего корпоратива. Сравнивайте поставщиков, выбирайте лучших и организовывайте без лишних хлопот.",
    },
    icon: Users,
    gradient: "from-slate-500 via-gray-600 to-zinc-500",
    keywords: ["corporate", "business", "catering", "conference"],
    suggestedCats: ["catering", "music", "decor"],
    checklist: ["Book venue", "Arrange catering", "Set up AV/tech", "Book entertainment", "Print materials"],
  },
  engagement: {
    label: "Engagements",
    labelHy: "Նշանդրեք",
    labelRu: "Помолвки",
    desc: "Plan the perfect engagement — from the ring moment to the celebration.",
    descHy: "Կատարյալ նշանդրեք կազմակերպե՛ք Salooote-ի մատակարարների օգնությամբ։",
    descRu: "Организуйте идеальную помолвку с помощью поставщиков Salooote.",
    about: {
      hy: "Նշանդրեքն անմոռանալի կلحظe է, որ պահանջում է կատարյալ կազմակերպում։ Salooote-ում կարող եք գտնել ծաղիկներ, տորթ, ֆոտոգրաֆ, ռոմանտիկ ձևավորում — ամեն ինչ Ձեր կատարյալ նշանդրեքի համար։",
      en: "An engagement is an unforgettable moment that deserves perfect planning. On Salooote, you can find flowers, cakes, photography, and romantic setups — everything for your perfect engagement.",
      ru: "Помолвка — незабываемый момент, требующий идеальной организации. На Salooote вы найдёте цветы, торты, фотографию и романтическое оформление — всё для идеальной помолвки.",
    },
    icon: Sparkles,
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    keywords: ["engagement", "proposal", "ring", "flowers", "romantic"],
    suggestedCats: ["flowers", "cakes", "photography"],
    checklist: ["Choose the venue", "Order flowers", "Get a cake", "Book photographer", "Plan the surprise"],
  },
  anniversary: {
    label: "Anniversaries",
    labelHy: "Ամյակ",
    labelRu: "Юбилеи",
    desc: "Honor every milestone with a celebration your loved ones will treasure.",
    descHy: "Ամյակն անմոռանալի դարձրե՛ք Salooote-ի լավագույն մատակարարների հետ։",
    descRu: "Сделайте юбилей незабываемым с лучшими поставщиками Salooote.",
    about: {
      hy: "Ամյակն ու հոբելյանն արժե նշել հատուկ կերպով։ Salooote-ում կարող եք գտնել ամեն ինչ, ինչ անհրաժեշտ է կատարյալ հոբելյանի համար՝ ձևավորում, տորթ, ծաղիկներ, ժամանցային ծրագիր և ոչ միայն։",
      en: "An anniversary deserves a special celebration. On Salooote, you can find everything needed for the perfect anniversary: decoration, cake, flowers, entertainment, and much more.",
      ru: "Юбилей заслуживает особого праздника. На Salooote вы найдёте всё необходимое: оформление, торт, цветы, развлекательную программу и многое другое.",
    },
    icon: Star,
    gradient: "from-orange-400 via-amber-500 to-yellow-400",
    keywords: ["anniversary", "celebration", "flowers", "cake", "romantic"],
    suggestedCats: ["cakes", "flowers", "catering"],
    checklist: ["Pick a venue", "Order a special cake", "Get flowers", "Plan dinner/event", "Arrange entertainment"],
  },
  "kids-party": {
    label: "Kids' Parties",
    labelHy: "Մանկական Տոններ",
    labelRu: "Детские Праздники",
    desc: "Create magical moments that little ones will remember forever.",
    descHy: "Երեխաների համար ստեղծե՛ք հեքիաթային հիշողություններ Salooote-ի մատակարարների հետ։",
    descRu: "Создайте сказочные воспоминания для детей с поставщиками Salooote.",
    about: {
      hy: "Մանկական տոները հատուկ են՝ փոքրիկ հոբելյարն ու հյուրերը կհիշեն ամեն մանրուք։ Salooote-ում կարող եք գտնել ամեն ինչ կատարյալ մանկական տոնի համար՝ թեմատիկ ձևավորում, տorta, մуультhherоsner, ժամanсային ծрагир և ոchh miain.",
      en: "Kids' parties are special — the little birthday star and guests will remember every detail. On Salooote, you can find everything for a perfect children's party: themed decoration, cakes, cartoon characters, entertainment programs, and much more.",
      ru: "Детские праздники особенные — именинник и гости запомнят каждую деталь. На Salooote вы найдёте всё для идеального детского праздника: тематическое оформление, торты, героев мультфильмов, развлекательные программы и многое другое.",
    },
    icon: Gift,
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    keywords: ["kids", "children", "birthday", "balloons", "party", "fun"],
    suggestedCats: ["cakes", "balloons", "catering"],
    checklist: ["Order themed cake", "Get balloons & decor", "Arrange entertainment", "Prepare party favors", "Invite friends"],
  },
};

const SUGGESTED_VENDORS = {
  balloons:             ["Balloon Decor", "Event Decoration", "Florists"],
  cakes:                ["Pastry & Cakes", "Desserts", "Catering"],
  "cartoon-characters": ["Animators", "Entertainment", "Performers"],
  gifts:                ["Gift Shops", "Packaging", "Personalized Gifts"],
  romantic:             ["Florists", "Balloon Decor", "Photography"],
  baptism:              ["Balloon Decor", "Pastry & Cakes", "Gift Shops"],
  "baby-tooth":         ["Balloon Decor", "Pastry & Cakes", "Gift Shops"],
  christmas:            ["Gift Shops", "Pastry & Cakes", "Holiday Decor"],
  wedding:              ["Cakes & Pastry", "Florists", "Catering", "Photography", "DJ & Music"],
  birthday:             ["Cakes & Pastry", "Balloons", "Catering", "Entertainment"],
  corporate:            ["Catering", "AV & Tech", "Entertainment", "Decor"],
  engagement:           ["Florists", "Cakes & Pastry", "Photography", "Jewelry"],
  anniversary:          ["Cakes & Pastry", "Florists", "Catering", "Entertainment"],
  "kids-party":         ["Cakes & Pastry", "Balloons & Decor", "Catering", "Animators"],
};

export default function EventTypeClient({ lang, type, dict }) {
  const meta = EVENT_META[type] || {
    label: type.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    labelHy: type.replace(/-/g, " "),
    labelRu: type.replace(/-/g, " "),
    desc: "Find the best vendors for your event on Salooote.",
    descHy: "Salooote-ում գտե՛ք լավագույն մատakararnerին Ձeր miçocarumи hamin.",
    descRu: "Найдите лучших поставщиков для вашего мероприятия на Salooote.",
    about: { hy: "", en: "", ru: "" },
    icon: Sparkles,
    gradient: "from-brand-500 to-brand-600",
    keywords: [],
    suggestedCats: [],
    checklist: [],
  };

  const Icon = meta.icon;
  const [products, setProducts] = useState([]);
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [checked, setChecked]   = useState({});

  useEffect(() => {
    const q = meta.keywords[0] || type;
    Promise.all([
      productsAPI.list({ search: q, limit: 10, locale: lang }).catch(() => null),
      vendorsAPI.list({ limit: 8 }).catch(() => null),
    ]).then(([pRes, vRes]) => {
      setProducts((pRes?.data || []).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug || "",
        vendor_slug: p.vendor_slug || "",
        price: parseFloat(p.price) || 0,
        originalPrice: p.compare_price ? parseFloat(p.compare_price) : null,
        rating: parseFloat(p.rating) || 0,
        reviews: p.review_count || 0,
        vendor: p.vendor_name || "",
        image: p.thumbnail_url || p.images?.[0]?.url || null,
        tags: p.tags || [],
        gradient: "from-brand-50 to-brand-100",
      })));
      setVendors(vRes?.data || []);
    }).finally(() => setLoading(false));
  }, [type, lang]);

  const localLabel = lang === "hy" ? meta.labelHy : lang === "ru" ? meta.labelRu : meta.label;
  const localDesc  = lang === "hy" ? meta.descHy  : lang === "ru" ? meta.descRu  : meta.desc;
  const aboutText  = meta.about?.[lang] || meta.about?.en || "";

  const headingProducts = lang === "hy" ? `${localLabel}-ի ապрanknery` : lang === "ru" ? `Продукты для ${localLabel}` : `Products for ${localLabel}`;
  const headingVendors  = lang === "hy" ? "Առаջаrkvоłи Мatаkаrаrner" : lang === "ru" ? "Рекомендуемые поставщики" : "Recommended Vendors";
  const headingAbout    = lang === "hy" ? `${localLabel}-ի Մаsiin` : lang === "ru" ? `О разделе` : `About`;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className={`bg-gradient-to-br ${meta.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
        <div className="max-w-container mx-auto px-6 md:px-8 py-16 relative">
          <Link href={`/${lang}`} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm no-underline mb-6 transition-colors">
            <ArrowLeft size={14} /> {lang === "hy" ? "Գлавная" : lang === "ru" ? "Главная" : "Home"}
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Icon size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{localLabel}</h1>
              <p className="text-white/80 text-base max-w-[480px]">{localDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="border-b border-surface-200 bg-surface-50">
        <div className="max-w-container mx-auto px-6 md:px-8 py-3 flex items-center gap-2 text-xs text-surface-400">
          <Link href={`/${lang}`} className="hover:text-brand-600 no-underline text-surface-400 transition-colors">
            {lang === "hy" ? "Главная" : lang === "ru" ? "Главная" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-surface-700 font-medium">{localLabel}</span>
        </div>
      </div>

      <div className="max-w-container mx-auto px-6 md:px-8 py-12">
        <div className="flex gap-10 flex-wrap lg:flex-nowrap">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Products */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">
                  {lang === "hy" ? `${localLabel} Апранкներ` : lang === "ru" ? `Товары — ${localLabel}` : `Products for ${localLabel}`}
                </h2>
                <Link href={`/${lang}/products`} className="text-sm text-brand-600 font-medium no-underline flex items-center gap-1 hover:gap-2 transition-all">
                  {lang === "hy" ? "Բоłory" : lang === "ru" ? "Все товары" : "Browse all"} <ChevronRight size={14} />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-[260px] bg-surface-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <ProductCard product={p} lang={lang} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center bg-surface-50 rounded-2xl border border-surface-200">
                  <p className="text-surface-400 text-sm mb-2">
                    {lang === "hy" ? "Ապранknер Аya Чken" : lang === "ru" ? "Пока нет товаров" : "No products yet for this event type."}
                  </p>
                  <Link href={`/${lang}/products`} className="text-brand-600 text-sm font-semibold no-underline hover:underline">
                    {lang === "hy" ? "Бolor апранкnеры →" : lang === "ru" ? "Все товары →" : "Browse all products →"}
                  </Link>
                </div>
              )}
            </div>

            {/* About section */}
            {aboutText && (
              <div className="mb-14">
                <h2 className="text-xl font-bold text-surface-900 mb-5">
                  {lang === "hy" ? localLabel + "-ի Маsiin" : lang === "ru" ? "О разделе" : "About"}
                </h2>
                <div className="bg-surface-50 rounded-2xl border border-surface-200 p-6">
                  {aboutText.split("\n\n").map((para, i) => (
                    <p key={i} className={`text-surface-600 leading-relaxed text-base${i < aboutText.split("\n\n").length - 1 ? " mb-4" : ""}`}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Vendors */}
            {vendors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-surface-900">
                    {lang === "hy" ? "Առаջаrkvоłи Мatаkаrаrner" : lang === "ru" ? "Рекомендуемые поставщики" : "Recommended Vendors"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vendors.slice(0, 6).map((v, i) => (
                    <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={`/${lang}/vendor/${v.slug}`} className="no-underline">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-brand-300 hover:shadow-md transition-all">
                          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {v.business_name?.[0] || "V"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-surface-900 text-sm truncate">{v.business_name}</p>
                            {v.city && <p className="text-xs text-surface-400 mt-0.5">{v.city}</p>}
                          </div>
                          <ChevronRight size={14} className="text-surface-300 ml-auto flex-shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: Planning Checklist ── */}
          {meta.checklist.length > 0 && (
            <div className="w-full lg:w-[300px] flex-shrink-0">
              <div className="bg-surface-50 rounded-2xl border border-surface-200 p-5 sticky top-24">
                <h3 className="font-bold text-surface-900 mb-4 text-sm">
                  {lang === "hy" ? `${localLabel} Checklist` : lang === "ru" ? `Чеклист` : `${localLabel} Checklist`}
                </h3>
                <div className="space-y-2">
                  {meta.checklist.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white transition-colors cursor-pointer border-none bg-transparent text-left"
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        checked[i] ? "bg-brand-600 border-brand-600" : "border-surface-300"
                      }`}>
                        {checked[i] && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${checked[i] ? "line-through text-surface-400" : "text-surface-700"}`}>
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-surface-200">
                  <p className="text-xs text-surface-400 text-center">
                    {Object.values(checked).filter(Boolean).length} / {meta.checklist.length} {lang === "ru" ? "выполнено" : lang === "hy" ? "կատарваd" : "done"}
                  </p>
                </div>
              </div>

              {/* Vendor categories needed */}
              <div className="mt-4 bg-white rounded-2xl border border-surface-200 p-5">
                <h3 className="font-bold text-surface-900 mb-3 text-sm">
                  {lang === "hy" ? "Ánhrajesht Мatаkаrаrner" : lang === "ru" ? "Нужные поставщики" : "Vendors you may need"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(SUGGESTED_VENDORS[type] || []).map((v, i) => (
                    <span key={i} className="text-xs bg-brand-50 text-brand-600 border border-brand-100 px-3 py-1.5 rounded-full font-medium">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
