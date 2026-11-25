-- Corsia Sicura – catalogue seed (Relazione Tecnica ANAS, Cap. 4, table 4.1.1)
-- Safe to run more than once.

insert into public.seasons (id, title, subtitle) values
  (1, 'Stagione 1', 'Riconoscere'),
  (2, 'Stagione 2', 'Reagire')
on conflict (id) do update set title = excluded.title, subtitle = excluded.subtitle;

insert into public.episodes (num, season_id, release_month, title, topic, area, duration_min, extra_code, mandatory_profiles, status) values
  (1,  1, 1,  'Il manipolatore gentile',           'Social Engineering',                     'L''inganno ha molte voci',       8,  null, '{}',                 'published'),
  (2,  1, 2,  'Quell''e-mail che sembra vera',      'Phishing',                               'L''inganno ha molte voci',       8,  null, '{}',                 'published'),
  (3,  1, 3,  'Allegati, link e mittenti',         'Email Security',                         'L''inganno ha molte voci',       7,  null, '{}',                 'published'),
  (4,  1, 4,  'La chiave di casa',                 'Password Management',                    'Identità e accessi',             8,  null, '{}',                 'published'),
  (5,  1, 5,  'Sanno chi sei',                     'Spear Phishing',                         'L''inganno ha molte voci',       7,  null, '{amministrativo}',   'published'),
  (6,  1, 6,  '«Pronto, sono della Direzione»',    'Vishing',                                'L''inganno ha molte voci',       7,  null, '{amministrativo}',   'published'),
  (7,  1, 7,  'L''ufficio in tasca',               'Mobile Security',                        'Dispositivi e spazi di lavoro',  7,  null, '{operativo}',        'published'),
  (8,  1, 8,  'Ospiti indesiderati',               'Malware',                                'Minacce software',               7,  null, '{}',                 'published'),
  (9,  1, 9,  'Il riscatto',                       'Ransomware',                             'Minacce software',               9,  null, '{}',                 'published'),
  (10, 1, 10, 'Navigare a vista',                  'Web Browsing',                           'Minacce software',               6,  null, '{}',                 'published'),
  (11, 1, 11, 'Casa, dolce ufficio',               'Smart Working',                          'Lavoro ibrido e digitale',       7,  null, '{}',                 'published'),
  (12, 1, 12, 'Il valore di un dato',              'Privacy e Data Protection',              'Informazioni e dati',            10, null, '{}',                 'published'),
  (13, 2, 13, 'Quello che posti resta',            'Social Media',                           'Informazioni e dati',            7,  null, '{}',                 'published'),
  (14, 2, 14, 'Non credere ai tuoi occhi',         'Deepfake e identità sintetiche',         'Minacce emergenti',              8,  'X1', '{management}',       'published'),
  (15, 2, 15, 'Vero, falso, verosimile',           'Fake News',                              'Informazioni e dati',            7,  null, '{}',                 'published'),
  (16, 2, 16, 'Chat, canali e file condivisi',     'Social Collaboration',                   'Lavoro ibrido e digitale',       7,  null, '{}',                 'published'),
  (17, 2, 17, 'Il collega artificiale',            'IA generativa: uso sicuro',              'Minacce emergenti',              8,  'X2', '{}',                 'published'),
  (18, 2, 18, 'Oggetti che parlano troppo',        'IoT Device',                             'Dispositivi e spazi di lavoro',  7,  null, '{operativo}',        'published'),
  (19, 2, 19, 'Quando il cyber scende in strada',  'Sicurezza OT e infrastrutture critiche', 'Contesto ANAS',                  9,  'X3', '{operativo}',        'published'),
  (20, 2, 20, 'La chiavetta nel parcheggio',       'USB Storage',                            'Dispositivi e spazi di lavoro',  5,  null, '{}',                 'published'),
  (21, 2, 21, 'Il fornitore che non era lui',      'Business Email Compromise',              'Contesto ANAS',                  8,  'X4', '{amministrativo}',   'published'),
  (22, 2, 22, 'Acquisti sicuri',                   'eCommerce',                              'Lavoro ibrido e digitale',       6,  null, '{}',                 'published'),
  (23, 2, 23, 'Scrivania pulita, dati al sicuro',  'Clean Desk',                             'Dispositivi e spazi di lavoro',  5,  null, '{}',                 'published'),
  (24, 2, 24, 'I primi 15 minuti',                 'Incident reporting e risposta',          'Contesto ANAS',                  9,  'X5', '{management}',       'published')
on conflict (num) do update set
  season_id = excluded.season_id,
  release_month = excluded.release_month,
  title = excluded.title,
  topic = excluded.topic,
  area = excluded.area,
  duration_min = excluded.duration_min,
  extra_code = excluded.extra_code,
  mandatory_profiles = excluded.mandatory_profiles,
  status = excluded.status,
  updated_at = now();
