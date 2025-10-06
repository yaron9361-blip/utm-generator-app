import telegramIcon from '/src/assets/icons/telegram.svg';
import vkIcon from '/src/assets/icons/vkontakte.svg';
import instagramIcon from '/src/assets/icons/instagram.svg';
import yandexIcon from '/src/assets/icons/yandex.svg';
import googleIcon from '/src/assets/icons/google.svg';

export const utmTemplates = [
  {
    id: 'telegram_post',
    name: 'Пост',
    logo: telegramIcon,
    category: 'Telegram',
    params: {
      utm_source: 'telegram',
      utm_medium: 'channel_post',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'telegram_stories',
    name: 'Stories',
    logo: telegramIcon,
    category: 'Telegram',
    params: {
      utm_source: 'telegram',
      utm_medium: 'stories',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'vk_post',
    name: 'Пост',
    logo: vkIcon,
    category: 'VKontakte',
    params: {
      utm_source: 'vk',
      utm_medium: 'social',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'vk_ads',
    name: 'Реклама',
    logo: vkIcon,
    category: 'VKontakte',
    params: {
      utm_source: 'vk',
      utm_medium: 'cpc',
      utm_campaign: 'vk_ads'
    }
  },
  {
    id: 'instagram_post',
    name: 'Пост',
    logo: instagramIcon,
    category: 'Instagram',
    params: {
      utm_source: 'instagram',
      utm_medium: 'social',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'instagram_stories',
    name: 'Stories',
    logo: instagramIcon,
    category: 'Instagram',
    params: {
      utm_source: 'instagram',
      utm_medium: 'stories',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'yandex_direct',
    name: 'Реклама',
    logo: yandexIcon,
    category: 'Яндекс.Директ',
    params: {
      utm_source: 'yandex',
      utm_medium: 'cpc',
      utm_campaign: 'direct'
    }
  },
  {
    id: 'google_ads',
    name: 'Реклама',
    logo: googleIcon,
    category: 'Google Ads',
    params: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'google_ads'
    }
  }
];