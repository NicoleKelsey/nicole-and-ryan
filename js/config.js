/* ==========================================================================
   NICOLE & RYAN - WEDDING WEBSITE CONFIGURATION
   --------------------------------------------------------------------------
   This is the ONLY file you normally need to edit.

   Rules of thumb
   • Anything set to null or "" is treated as "not confirmed yet" and the site
     shows a gentle placeholder ("To be confirmed") instead of an empty gap.
   • Never invent details here. Leave null until it is real.
   • Never put passwords, bank details or secret keys in this file - it is
     public once the site is published.
   • Image paths are relative to index.html, e.g. "assets/images/hero.jpg".
   ========================================================================== */

window.WEDDING_CONFIG = {

  /* ---------- Site / search / social sharing ---------- */
  site: {
    title: "Nicole & Ryan | 18 September 2027",
    description: "Join Nicole & Ryan as they celebrate their wedding at Annerkant Venue, Kirkwood, Eastern Cape on Saturday, 18 September 2027.",
    // After publishing, put your full address here, e.g.
    // "https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/". (Share-preview tags are fixed in index.html; change them there if your address changes.)
    publicUrl: null,
    // Optional share-preview picture (1200x630 jpg). Needs publicUrl set.
    shareImage: null,
  },

  /* ---------- Couple & date (CONFIRMED) ---------- */
  couple: {
    name1: "Nicole",
    name2: "Ryan",
    monogram: "N&R",
  },
  wedding: {
    // The countdown runs to the START of this day in South Africa (UTC+2).
    startsAtIso: "2027-09-18T00:00:00+02:00",
    displayDate: "Saturday, 18 September 2027",
    shortDate: "18 September 2027",
    timeZoneLabel: "South African Standard Time (SAST, UTC+2)",
    town: "Kirkwood, Eastern Cape",
    country: "South Africa",
  },

  /* ---------- Images (set to null to use the elegant placeholder) ---------- */
  images: {
    hero: "assets/images/hero.webp",   // landscape background photo
    story: "assets/images/story.webp", // portrait photo beside the "Our Story" intro
    storyPhotoAlt: "Nicole and Ryan embracing on the beach at sunset",
    photoCredit: "Engagement photography: Kaalvoet Foto's",   // shown in the footer; set null to hide
  },

  /* ---------- Navigation (labels are editable; ids must match the sections) ---------- */
  nav: [
    { label: "Home", id: "home" },
    { label: "Our Story", id: "story" },
    { label: "Wedding Details", id: "details" },
    { label: "Schedule", id: "schedule" },
    { label: "Accommodation", id: "accommodation" },
    { label: "FAQ", id: "faq" },
    { label: "Gallery", id: "gallery" },
    { label: "Gifts", id: "gifts" },
  ],
  rsvpButtonLabel: "RSVP",

  /* ---------- Messages ---------- */
  messages: {
    heroWelcome: "We are so happy you are here. Together with our families, we can't wait to celebrate the beginning of our forever with you.",
    welcomeTitle: "Welcome, dear family and friends",
    welcomeBody: "Thank you for being part of our story. This website will hold everything you need to know about our day, from where to stay to what to wear. We'll keep it updated as our plans come together.",
    countdownDone: "Today is the day, we're getting married!",
    countdownAfter: "We're married! Thank you for celebrating with us.",
    tbc: "To be confirmed",
  },

  /* ---------- Our Story (PLACEHOLDER TEXT - replace with yours) ---------- */
  story: {
    intro: "Every love story is beautiful, but ours is our favourite. Here is a little of how we got here.",
    // Each item becomes a point on the timeline. 'text' is a list of paragraphs (wrap words in **double stars** for bold).
    // Add / remove / reorder freely. 'when' is optional (e.g. "Summer 2019").
    timeline: [
      { title: "How we met", when: null, text: [
        "Our story began long before we ever imagined we'd end up here.",
        "Ryan and I went to the same primary school and high school, growing up knowing each other as friends. Little did we know that one day, those familiar faces would become each other's favourite person.",
        "Then came 25 June 2022, at the Kirkwood Wildsfees, the day everything started to change. I decided to make the first move, and let's just say Ryan fell right into my little trap! 😂❤️",
        "A few months later, on 10 October 2022, at Schoemanskroon Farm just outside Kirkwood, Ryan officially asked me to be his girlfriend during a picnic in a field. And from that day on, we became practically inseparable.",
        "What started with a little courage, a first move, and two people who had known each other for years grew into a love neither of us could have imagined back in our school days.",
        "Now, we're getting ready to say \"I do\" and begin our next chapter as husband and wife. Who would have thought that two school friends would one day find their forever in each other? 💍",
      ] },
      { title: "Our first date", when: null, text: [
        "Our first date was nothing fancy, just a trip to Burger King in Uitenhage, followed by a little gambling at Galaxy.",
        "What started as a simple date turned into Nicole trying her luck at the slots… and losing Ryan's money! 😂❤️",
        "Let's just say I won his heart, but definitely didn't win him any money!",
        "Luckily, he decided I was worth the investment, because here we are, getting ready to spend the rest of our lives together. 💍❤️",
      ] },
      { title: "Our journey together", when: null, text: [
        "Our journey has always been about growing together, supporting each other's dreams, and building a future we could call our own.",
        "In 2023, we moved in with Ryan's parents for two years while we saved up for a place of our own. During this time, Ryan started working in his dad's company while I focused on finishing my final year of university. It was a time of learning, growing, and making sacrifices together, all while working towards the life we dreamed of.",
        "In 2025, our hard work paid off, and we moved into our very first home! 🏡❤️ We brought Lexi, Ryan's beautiful girl, along with us and welcomed a new family member, Leo, our playful boy. Together, the two of them completed our little family, and we honestly couldn't imagine life without them. After all, a house isn't truly a home without a little love, a lot of paws, and plenty of chaos! 🐾❤️",
        "Since then, we've continued to grow in our own ways. Ryan has built his career in the family business alongside his dad, while I've built a successful career of my own. We've celebrated achievements, learned valuable lessons, and continued working towards a future together.",
        "Looking back, we're so proud of how far we've come, from two school friends who found their way to each other, to building a home, a family, and a life filled with love.",
        "And now, our next big adventure awaits: becoming husband and wife and continuing this journey, side by side, for the rest of our lives. 💍❤️",
      ] },
      { title: "The proposal", when: null, text: [
        "Ryan told me he was taking me out for our fourth anniversary, but little did I know he had a much bigger surprise planned!",
        "After a little detour to the beach and a photographer who was secretly part of the plan, I turned around to find Ryan ready to ask me the most important question of my life.",
        "**\"Nicole Kelsey, Will you marry me?\"** 🥹💍",
        "Of course, I said YES! ❤️",
        "Ryan then spoiled me with a romantic night in the Romantic Suite at The Boardwalk Hotel, complete with a delicious dinner and breakfast buffet.",
        "And to top it all off, we ended the night at the casino, where I finally won back the money I lost on our very first date! 😂❤️",
        "From our first date to forever, our love story just keeps getting better.",
      ] },
    ],
    messageTitle: "The Best Is Yet to Come! 🥂💍",
    messageToGuests: [
      "We found our person, made it official, and now we're making it everyone's problem… by throwing a wedding! 😂❤️",
      "Get ready for a day full of love, laughter, happy tears, and questionable dance moves. We can't wait to celebrate with you!",
      "**Love, Nicole & Ryan 🤍**",
    ],
    placeholderText: "Our story is coming soon. We'll share it here.",
  },

  /* ---------- Wedding details ----------
     Fill in as things are confirmed. null = shows "To be confirmed". */
  details: {
    venueName: "Annerkant Venue",
    venueAddress: "H9RW+F3, Nqweba",   // Google Maps plus code
    ceremonyLocation: null,
    receptionLocation: null,       // leave null if the same as the ceremony venue
    guestArrivalTime: "13:30",
    ceremonyTime: "14:00",
    receptionTime: "17:00",
    finishTime: "00:00",
    dressCode: "Smart casual",
    parking: null,
    accessibility: null,
    weatherPlan: null,
    guestInstructions: null,
    // Optional: paste a Google Maps share link. If null but venueAddress is set,
    // a directions link is built automatically from the address.
    mapsQuery: "Annerkant Venue, H9RW+F3, Nqweba",   // used for the directions button AND the embedded map
    mapsUrl: null,
  },

  /* ---------- Travel ---------- */
  travel: {
    general: null,           // e.g. advice for guests travelling from outside Kirkwood
    parking: null,
    transport: null,         // optional shuttle / lift-club arrangements
    accommodationToVenue: null,
    overnightReminder: "Kirkwood is a small town, so we recommend arranging overnight accommodation well in advance.",
  },

  /* ---------- Schedule ----------
     SUGGESTED running order only. Set confirmed:true once the real timings are agreed
     (the "to be confirmed" notice disappears automatically). */
  schedule: {
    confirmed: false,
    notice: "Arrival, ceremony, reception and finish times are confirmed. The other times will be confirmed closer to the day.",
    items: [
      { time: "13:30", title: "Guest arrival", note: null },
      { time: "14:00", title: "Ceremony", note: null },
      { time: null, title: "Congratulations & photographs", note: null },
      { time: null, title: "Canapés & refreshments", note: null },
      { time: "17:00", title: "Reception begins", note: null },
      { time: null, title: "Dinner", note: null },
      { time: null, title: "Speeches", note: null },
      { time: null, title: "Cake cutting", note: null },
      { time: null, title: "First dance", note: null },
      { time: null, title: "Dancing & celebrations", note: null },
      { time: "00:00", title: "Finish", note: null },
    ],
  },

  /* ---------- Accommodation ----------
     Real options are listed below. Add website/bookingLink where you have the links. Every field except 'name' is optional;
     blank fields simply don't appear. Remove a card by deleting its { ... } block. */
  accommodation: {
    bookEarlyMessage: "Please book early! Kirkwood has limited accommodation and our wedding falls on 18 September 2027. Confirm availability and pricing directly with each provider.",
    disclaimer: "Capacities are as listed by the providers or booking sites and may differ. Availability and prices are not confirmed. Always check directly with the provider.",
    items: [
      {
        type: "Guesthouse",
        name: "Upper Room Guesthouse",
        location: "36 Middle Street, Kirkwood",
        capacity: "Up to 30 guests",
        notes: "One of the larger options in Kirkwood. TravelGround lists up to 30 guests, but the LekkeSlaap listing says it sleeps 12, so please confirm the total directly.",
        bookingLink: "https://www.lekkeslaap.co.za/accommodation/upper-room-guest-house",
        image: "assets/images/stay-upper-room.webp",
        imageAlt: "Upper Room Guesthouse, Kirkwood",
      },
      {
        type: "Guesthouse · family rooms · self-catering",
        name: "Nadora's Rest Guesthouse",
        location: "8 Isabel Street, Kirkwood",
        capacity: "Up to 36 guests (LekkeSlaap)",
        notes: "Guest rooms, family rooms and self-catering accommodation. LekkeSlaap lists 36 guests but another booking site lists 20, so please confirm the total with the property.",
        familyFriendly: "Family rooms available",
        website: "https://nadorasrest.co.za/",
        bookingLink: "https://www.lekkeslaap.co.za/accommodation/nadoras-rest",
        image: "assets/images/stay-nadoras-rest.webp",
        imageAlt: "Nadora's Rest Guesthouse, Kirkwood",
      },
      {
        type: "Guesthouse",
        name: "Kirkwood Guest House",
        location: "26 Mark Street, Kirkwood",
        capacity: "Total capacity not confirmed",
        notes: "A traditional guesthouse. Room types: Standard (1–2 guests), Twin (2) and Deluxe Double (2); extra person or child R150 per night by arrangement (per their website). Please ask how many rooms are available.",
        phone: "064 658 9917",
        email: "info@kirkwoodguesthouse.co.za",
        website: "https://kirkwoodguesthouse.co.za/",
        image: "assets/images/stay-kirkwood-guest-house.webp",
        imageAlt: "Entrance of Kirkwood Guest House, 26 Mark Street",
      },
      {
        type: "Guesthouse & restaurant",
        name: "Kronenhoff Guest House & Restaurant",
        capacity: "18 double suites (per their website)",
        notes: "Guesthouse and restaurant near Addo Elephant National Park. Contact the property to confirm room availability and group rates.",
        website: "https://kronenhoff.co.za/",
        image: "assets/images/stay-kronenhoff.webp",
        imageAlt: "Kronenhoff Guest House & Restaurant, Kirkwood",
      },
      {
        type: "Self-catering house",
        name: "Rest @ Mimosa",
        capacity: "4 guests (maximum, per the property's website)",
        bedrooms: "2 bedrooms, 2 bathrooms",
        familyFriendly: "Suitable for a family or small group of friends",
        notes: "Self-catering house.",
        website: "https://restatmimosa.co.za/",
        image: "assets/images/stay-rest-at-mimosa.webp",
        imageAlt: "Rest @ Mimosa self-catering house, Kirkwood",
      },
      {
        type: "Self-catering cabins & campsites",
        name: "Sitrusoewer River Camp",
        location: "Beside the Sundays River",
        distance: "Approximately 8 km from Kirkwood",
        capacity: "About 17 guests in the cabins, plus additional guests at the campsites",
        bedrooms: "4 cabins: three sleep up to 4 each, the Fish Eagle cabin sleeps up to 5",
        notes: "Ideal for guests who enjoy camping, caravans or a relaxed self-catering stay by the river.",
        phone: "042 232 0503",
        email: "anneke@sitrusoewer.co.za",
        website: "https://www.sitrusoewer.co.za/",
        bookingLink: "https://www.sitrusoewer.co.za/cabins-campsites",
        image: "assets/images/stay-sitrusoewer.webp",
        imageAlt: "Sitrusoewer River Camp beside the Sundays River",
      },
      {
        type: "Self-catering farm, venue & campsites",
        name: "Nieshoutkloof Camping",
        location: "Kirkwood, Eastern Cape",
        capacity: "Sleeps 8 (the farm listing also includes campsites and Aragon's Villa)",
        bedrooms: "4 bedrooms",
        priceRange: "From R3 000 per night for the 8-sleeper (per LekkeSlaap)",
        notes: "Please check the listing for the other rooms and campsite options.",
        bookingLink: "https://www.lekkeslaap.co.za/accommodation/nieshoutkloof-camping",
        image: "assets/images/stay-nieshoutkloof.webp",
        imageAlt: "Nieshoutkloof Camping, Kirkwood",
      },
      {
        type: "Self-catering",
        name: "The Bird's Nest in the Valley",
        location: "Kirkwood, Eastern Cape",
        capacity: "Sleeps 4 (the description also says the room takes up to 2 guests at a time, so please confirm)",
        bedrooms: "2 bedrooms (one unit)",
        priceRange: "From R1 095 per night for 4 people (per LekkeSlaap)",
        notes: "Overnight room with a private entrance.",
        bookingLink: "https://www.lekkeslaap.co.za/accommodation/the-birds-nest-in-the-valley",
        image: "assets/images/stay-birds-nest.webp",
        imageAlt: "The Bird's Nest in the Valley, Kirkwood",
      },
      {
        type: "Self-catering",
        name: "Stay @ Searle",
        location: "2 Searle Street, Nqweba, Kirkwood",
        capacity: "Sleeps 2",
        bedrooms: "1 bedroom, 1 bathroom",
        priceRange: "From R1 100 per night for 2 people (per LekkeSlaap)",
        notes: "A cosy, charming unit.",
        bookingLink: "https://www.lekkeslaap.co.za/accommodation/stay--searle",
        image: "assets/images/stay-searle.webp",
        imageAlt: "Stay @ Searle, Kirkwood",
      },
      {
        type: "Self-catering",
        name: "Clivedon Cottage",
        location: "Kirkwood, Eastern Cape",
        capacity: "Sleeps 4 across 2 units",
        bedrooms: "2 units (Clivedon Cottage and the Astor Room suite), 1 bedroom each",
        priceRange: "From R1 500 per night for 2 guests (per LekkeSlaap)",
        bookingLink: "https://www.lekkeslaap.co.za/accommodation/clivedon-cottage",
        image: "assets/images/stay-clivedon-cottage.webp",
        imageAlt: "Clivedon Cottage, Kirkwood",
      },
    ],
    /* Example of a complete (real) entry - copy, un-comment and fill in:
    {
      type: "Guesthouse",
      name: "Property name",
      image: "assets/images/stay-1.jpg",
      imageAlt: "Front of the guesthouse",
      location: "Street / area",
      distance: "x km from the venue",
      capacity: "Sleeps 10",
      bedrooms: "5",
      priceRange: "R900 – R1 400 per room per night",
      phone: "+27 00 000 0000",
      website: "https://example.com",
      bookingLink: "https://example.com/book",
      parking: "Secure on-site parking",
      familyFriendly: "Yes",
      notes: "Anything else guests should know",
    },
    */
  },

  /* ---------- FAQ (questions and answers are fully editable) ---------- */
  faq: [
    { q: "When and where is the wedding?", a: "We're getting married on Saturday, 18 September 2027 at Annerkant Venue (Nqweba), Eastern Cape. Use the directions button in Wedding Details to find us on Google Maps." },
    { q: "What time should we arrive?", a: "Guests are welcome from 13:30. The ceremony starts at 14:00, and the reception begins at 17:00." },
    { q: "What should we wear?", a: "The dress code is smart casual." },
    { q: "Are children invited?", a: "To be confirmed. Your invitation will state who is invited." },
    { q: "Can I bring a plus-one?", a: "Your invitation will say how many guests are included. The RSVP form only allows the number of guests on your invitation." },
    { q: "How do I RSVP?", a: "Use the RSVP form on this website once it opens. If you'd rather reply another way, please contact us (details in the Contact section)." },
    { q: "When is the RSVP deadline?", a: "The RSVP deadline is to be confirmed." },
    { q: "What should I do if my plans change?", a: "Please let us know as soon as possible by contacting us, or by submitting the RSVP form again with the same name. Your latest response replaces the earlier one." },
    { q: "Are there vegetarian or other dietary options?", a: "Catering details are to be confirmed. Please tell us about any dietary requirements in your RSVP so we can plan." },
    { q: "What if I have a food allergy?", a: "Please list any allergies in your RSVP so we can pass them to the caterers." },
    { q: "Is parking available?", a: "Parking information is to be confirmed once the venue is finalised." },
    { q: "Can we take photographs during the ceremony?", a: "To be confirmed. We'll let you know whether we'd like an unplugged ceremony." },
    { q: "Will drinks be provided, or should guests bring their own?", a: "Drinks arrangements are to be confirmed." },
    { q: "What happens if it rains?", a: "Our weather plan will be shared once the venue is confirmed." },
    { q: "Where can I stay nearby?", a: "See the Accommodation section. Please book early and confirm availability directly with the provider." },
    { q: "Who should I contact with questions?", a: "See the Contact section at the bottom of the page." },
  ],

  /* ---------- Gallery ----------
     Drop image files into assets/images/ and list them here.
     src: null (or a missing file) shows an elegant placeholder tile.
     category is a free-text label (e.g. Engagement, Memories, Pre-wedding, Wedding). */
  gallery: {
    intro: "A few moments from the day Ryan asked, with more to come.",
    items: [
      { src: "assets/images/gallery-1.webp", alt: "Ryan kneeling on the beach holding out a ring box while Nicole claps with joy", caption: "The proposal", category: "Engagement" },
      { src: "assets/images/gallery-2.webp", alt: "Nicole and Ryan kissing on the beach after the proposal", caption: "She said yes", category: "Engagement" },
      { src: "assets/images/gallery-3.webp", alt: "Nicole's engagement ring on her hand, holding a phone showing a photo of the couple", caption: "Our first photo as an engaged couple", category: "Engagement" },
      { src: "assets/images/gallery-4.webp", alt: "Nicole's hand with her engagement ring resting over Ryan's hand on his chest", caption: "Hand in hand", category: "Engagement" },
      { src: "assets/images/gallery-5.webp", alt: "Ryan kissing Nicole's hand while she smiles at him in the golden light", caption: "Golden hour", category: "Engagement" },
      { src: "assets/images/gallery-6.webp", alt: "Nicole laughing on the beach at sunset, holding Ryan's hand", caption: "Pure joy", category: "Engagement" },
    ],
  },

  /* ---------- Gifts ---------- */
  gifts: {
    personalMessage: "Your presence at our wedding is the greatest gift. If you'd like to give something as well, we are so grateful, but please never feel any obligation.",
    // Add real links only. Example: { label: "Our registry", url: "https://..." }
    registryLinks: [],
    suggestions: null,          // e.g. text describing gift ideas
    honeymoonNote: null,        // e.g. text about honeymoon contributions
    contributionLinks: [],      // e.g. { label: "Honeymoon fund", url: "https://..." }
    moreDetailsMessage: "More details to follow.",
  },

  /* ---------- Announcements ----------
     Newest first is typical. Add / remove / reorder freely.
     date: "YYYY-MM-DD" or null. Empty list shows a friendly message. */
  announcements: [
    { date: null, title: "Save the date", text: "We're getting married on Saturday, 18 September 2027 at Annerkant Venue, Nqweba, Eastern Cape. Further details to follow." },
  ],

  /* ---------- Contact ----------
     Only valid values create links. Nothing here is invented. */
  contact: {
    name: null,                  // e.g. "Nicole"
    email: null,                 // e.g. "name@example.com"
    whatsappNumber: null,        // display, e.g. "+27 82 000 0000"
    whatsappLink: null,          // e.g. "https://wa.me/27820000000"
    message: "Questions? We'd love to hear from you.",
  },

  /* ---------- RSVP ----------
     See README.md → "Set up RSVP". Until `endpoint` is set the form is
     visibly closed and can never claim a response was saved. */
  rsvp: {
    endpoint: null,              // Google Apps Script web-app URL (ends in /exec)
    deadline: null,              // e.g. "30 June 2027" - null shows "To be confirmed"
    maxGuestsPerInvitation: 2,   // total people on one invitation, including the guest.
                                 // ALSO enforced on the server (apps-script/Code.gs).
    childrenInvited: false,      // true shows children questions
    requireInvitationCode: false,// true = guests must type the code printed on their invitation
    closedMessage: "RSVPs are not open yet. We'll announce here as soon as they are.",
  },

  /* ---------- Song requests ----------
     Uses the same RSVP backend. Songs are saved privately in your Sheet (tab "Songs"). */
  songs: {
    enabled: true,
    title: "Request a song",
    intro: "Help us build the dance-floor playlist! Tell us the song that will get you out of your seat.",
    maxPerGuest: 3,        // also enforced on the server (Script Property MAX_SONGS_PER_GUEST)
  },

  /* ---------- Opening envelope ----------
     replay: "always"  = the envelope shows every time the page loads or is refreshed
             "session" = once per visit (a refresh in the same tab skips it)
     enabled: false hides the envelope completely. */
  intro: {
    enabled: true,
    replay: "always",
  },

  /* ---------- Atmosphere ---------- */
  effects: {
    petals: false,          // gently falling petals (automatically off for visitors who prefer reduced motion)
    tapBurst: true,         // confetti of hearts & petals when guests tap the page, and when the invitation opens
  },

  /* ---------- Privacy notice (keep accurate with your real setup) ---------- */
  privacy: {
    collected: "Your name, whether you can attend, the number of guests in your party and their names, and, only if you choose to give them, dietary requirements, allergies, accessibility needs, song requests and a message to us.",
    purpose: "To plan the wedding: seating, catering, venue access, the music playlist and keeping in touch about the day.",
    storage: "Responses are sent securely to a private Google Sheet owned by Nicole and Ryan (via a Google Apps Script). They are never published on this website or in its source code. The venue map is provided by Google Maps.",
    access: "Only Nicole and Ryan (and anyone they directly ask to help with catering or planning) can see responses. Google, as the service provider, processes the data on our behalf.",
    corrections: "To correct or delete your response, contact us (see Contact), or resubmit the form with the same name to replace it.",
    retention: "We will delete all RSVP data within 90 days after the wedding.",
  },
};
