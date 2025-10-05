export const utmTemplates = [
  {
    id: 'telegram_post',
    name: 'Пост в канале',
    icon: '✈️',
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
    icon: '✈️',
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
    icon: '🔵',
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
    icon: '🔵',
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
    icon: '📸',
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
    icon: '📸',
    category: 'Instagram',
    params: {
      utm_source: 'instagram',
      utm_medium: 'stories',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'facebook_post',
    name: 'Пост',
    icon: '👥',
    category: 'Facebook',
    params: {
      utm_source: 'facebook',
      utm_medium: 'social',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'direct_messenger',
    name: 'Личные сообщения',
    icon: '💬',
    category: 'Мессенджеры',
    params: {
      utm_source: 'direct',
      utm_medium: 'messenger',
      utm_campaign: 'dm'
    }
  },
  {
    id: 'yandex_direct',
    name: 'Контекстная реклама',
    icon: '🔴',
    category: 'Яндекс.Директ',
    params: {
      utm_source: 'yandex',
      utm_medium: 'cpc',
      utm_campaign: 'direct'
    }
  },
  {
    id: 'google_ads',
    name: 'Контекстная реклама',
    icon: '🟢',
    category: 'Google Ads',
    params: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'google_ads'
    }
  }
];