export const utmTemplates = [
  {
    id: 'telegram_post',
    name: 'Пост в канале',
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%2326a5e4" width="40" height="40" rx="8"/%3E%3C/svg%3E',
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
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%2326a5e4" width="40" height="40" rx="8"/%3E%3C/svg%3E',
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
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%230077ff" width="40" height="40" rx="8"/%3E%3C/svg%3E',
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
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%230077ff" width="40" height="40" rx="8"/%3E%3C/svg%3E',
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
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23E4405F" width="40" height="40" rx="8"/%3E%3C/svg%3E',
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
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23E4405F" width="40" height="40" rx="8"/%3E%3C/svg%3E',
    category: 'Instagram',
    params: {
      utm_source: 'instagram',
      utm_medium: 'stories',
      utm_campaign: 'organic'
    }
  },
  {
    id: 'yandex_direct',
    name: 'Контекстная реклама',
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23FC3F1D" width="40" height="40" rx="8"/%3E%3C/svg%3E',
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
    logo: 'data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%234285F4" width="40" height="40" rx="8"/%3E%3C/svg%3E',
    category: 'Google Ads',
    params: {
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'google_ads'
    }
  }
];