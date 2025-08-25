'use server';

import { cookies } from 'next/headers';

// export async function createCookies(name, token) {
// //   // Function to calculate the timestamp for the expiration date

// //   // Set the cookie with a maxAge of 1 day from now
// //   const OneDay = 24 * 60 * 60 * 1000;
// //   cookies().set(name, token, { maxAge: OneDay });
// // }

export async function createCookies(name, value, options = {}) {
  const defaultOptions = {
    maxAge: 24 * 60 * 60 * 1000, // Default: 1 day
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  cookies().set(name, value, { ...defaultOptions, ...options });
}

export async function getCookies(name) {
  return cookies().get(name)?.value;
}

export async function deleteCookies(name) {
  cookies().delete(name);
}
