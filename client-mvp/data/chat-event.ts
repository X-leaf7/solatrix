export async function getChatEvent() {
  return [
    {
      id: 'random',
      text: 'Our defense is solid. Watch out for our counter-attacks.',
      profileImage: '',
      isCurrentUser: false,
    },
    {
      id: 'random-2',
      text: "We'll see about that. Messi’s on fire lately.",
      profileImage: '',
      isCurrentUser: true,
    },
    {
      id: 'random-3',
      text: 'We’ve got a plan for him. 😉',
      profileImage: '',
      isCurrentUser: false,
    },
    {
      id: 'random-4',
      text: 'Good luck. You’ll need it.',
      profileImage: '',
      isCurrentUser: true,
    },
  ];
}
