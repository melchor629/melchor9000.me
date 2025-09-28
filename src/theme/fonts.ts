/* eslint-disable camelcase */
import { Roboto_Flex, Roboto_Mono } from 'next/font/google'

export const robotoMono = Roboto_Mono({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--me-roboto-mono-font',
})

export const robotoFlex = Roboto_Flex({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--me-roboto-flex-font',
})
