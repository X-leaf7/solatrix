export async function getChatEvent() {
  return [
    {
      id: 'random',
      text: 'Our defense is solid. Watch out for our counter-attacks.',
      profile_image: '',
      is_current_user: false,
    },
    {
      id: 'random-2',
      text: "We'll see about that. Messi’s on fire lately.",
      profile_image: '',
      is_current_user: true,
    },
    {
      id: 'random-3',
      text: 'We’ve got a plan for him. 😉',
      profile_image: '',
      is_current_user: false,
    },
    {
      id: 'random-4',
      text: 'Good luck. You’ll need it.',
      profile_image: '',
      is_current_user: true,
    },
  ];
}
