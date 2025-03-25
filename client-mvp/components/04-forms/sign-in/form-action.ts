'use server';

import { redirect } from 'next/navigation';

export async function formAction(data: FormData) {
  const email = data.get('email');
  const code = data.get('code');

  console.log(email, code);

  if (email) {
    redirect('/sign-in?step=2');
  }

  if (code) {
    redirect('/?onboarding=true');
  }
}
