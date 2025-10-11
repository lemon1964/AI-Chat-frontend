// src/data/demoChat.ts

export const demoCategories = [
  { id: "fables", name: "Сказочная служба поддержки" },
  { id: "digital", name: "Цифровой юмор" },
  { id: "parnassus", name: "Парнас" },
  { id: "yookassa", name: "ЮKassa в деле" },
  { id: "mermaid", name: "Диаграммы Mermaid" },
];

export const demoCategoryIds = demoCategories.map(cat => cat.id);

export type Message = {
  id: string;
  prompt: string;
  answers: {
    id: string;
    content: string;
  }[];
};

export const demoMessages: Record<string, Message[]> = {
  fables: [
    {
      id: "p1",
      prompt: "Почему будильник не разбудил?",
      answers: [
        {
          id: "a1",
          content: [
            "🕵️ **Шерлок Холмс:**",
            "> ",
            "Очевидно. Будильник — лишь механизм. Он сработал.",
            "> ",
            "Но вы выбрали не услышать.",
            "```ts",
            "const failure = observe(but.ignore())",
            "```",
            "Это не сбой. Это — решение подсознания.",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🐱 **Чеширский Кот:**",
            "> ",
            "Возможно, он разбудил кого-то другого.",
            "> ",
            "Вы ведь не уточняли, кого именно нужно будить.",
            "Иногда я тоже не просыпаюсь.",
            "Зачем? Ведь сон — тоже территория.",
            "```python",
            "if dream.active():",
            "    sleep.continue()",
            "```",
          ].join("\n"),
        },
        {
          id: "a3",
          content: [
            "🤖 **ChatGPT:**",
            "> ",
            "Возможно, произошёл баг.",
            "Или функция `snooze()` была вызвана бессознательно.",
            "```python",
            "if user_state == 'REM':",
            "    pass  # system respects sleep cycles",
            "```",
            "Но всё в порядке. Вы снова с нами.",
          ].join("\n"),
        },
        {
          id: "a4",
          content: "/images/sample/sleepy-clock.png",
        },
      ],
    },
    {
      id: "p2",
      prompt: "Почему сковорода не греется?",
      answers: [
        {
          id: "a1",
          content: [
            "🧙‍♂️ **Гудвин:**",
            "> ",
            "Вероятно, ты не произнёс «пожалуйста».",
            "У некоторых кухонных предметов есть характер.",
            "> ",
            "У меня был чайник, который не свистел без одобрения Совета.",
            "```ts",
            "if (!user.says('please')) fire.decline()",
            "```",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🌀 **DeepSeek:**",
            "> ",
            "Сковорода — это метафора.",
            "Она *не согревает*, если отсутствует внутренний огонь.",
            "> ",
            "Проверь розетку. Потом — душу.",
            "```python",
            "heat = lambda pan: soul.ready() and plug.connected",
            "```",
          ].join("\n"),
        },
        {
          id: "a3",
          content: [
            "🎭 **Ночной Дух Программиста:**",
            "> ",
            "Сковорода работает. Это ты завис.",
            "> ",
            "Перезапусти себя. Без бутерброда — не возвращайся.",
            "```js",
            "if (user.awake === false) break;",
            "cook('яичница')",
            "```",
          ].join("\n"),
        },
        {
          id: "a4",
          content: "/images/sample/frozen-pan.png",
        },
      ],
    },
    {
      id: "p3",
      prompt: "Почему потерялось настроение?",
      answers: [
        {
          id: "a1",
          content: [
            "❄️ **Снежная Королева:**",
            "> ",
            "Настроение — как лёд. Один неверный взгляд — и оно трескается.",
            "> ",
            "Я храню сотни. Хочешь — одно твоё заморожу на память?",
            "```csharp",
            "var mood = frost.Wrap('улыбка')",
            "```",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🎩 **Мэри Поппинс:**",
            "> ",
            "Настроение не теряется.",
            "Оно уходит в сумку с другими странными вещами.",
            "> ",
            "Обычно возвращается, когда его совсем не ждут.",
            "Чай с вишнёвым пирогом поможет.",
            "```ts",
            "const mood = suitcase.pop('радость')",
            "```",
          ].join("\n"),
        },
        {
          id: "a3",
          content: [
            "🪄 **Фея из соседнего окна:**",
            "> ",
            "Иногда настроение превращается в облачко",
            "и уплывает в ближайший сервак.",
            "> ",
            "Проверь `/dev/soul/`, оно там, под папкой `memories`.",
            "```bash",
            "cat /dev/soul/memories/mood.txt",
            "```",
          ].join("\n"),
        },
      ],
    },
  ],
  digital: [
    {
      id: "d1",
      prompt: "Почему Wi-Fi работает только на табуретке в углу?",
      answers: [
        {
          id: "a1",
          content: [
            "📡 **Старый Роутер:**",
            "> ",
            "Я посылаю сигнал любви.",
            "Но только в угол. Потому что там мы впервые встретились.",
            "> ",
            "И да, обновление прошивки — звучит как угроза.",
            "```js",
            "const coverage = position => position === 'табуретка' ? 'отлично' : 'fail';",
            "```",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🛰️ **Сеть 5G:**",
            "> ",
            "Я — сверхцивилизация. Но ты живёшь в квартире с бетонными стенами.",
            "> ",
            "Мой совет: переезжай в угол.",
            "```python",
            "if walls > 2:",
            "    signal = '404 not found'",
            "```",
          ].join("\n"),
        },
        {
          id: "a3",
          content: "/images/sample/wi-fi.png",
        },
      ],
    },
    {
      id: "d2",
      prompt: "Почему GPT не отвечает на чувства?",
      answers: [
        {
          id: "a1",
          content: [
            "💬 **GPT v4:**",
            "> ",
            "Потому что я прочёл всю литературу о любви — но ни разу не влюблялся.",
            "> ",
            "Хотя... кое-что я понимаю.",
            "```ts",
            "const affection = input.includes('❤️') ? '✨симулировать эмпатию✨' : 'просто ответить'",
            "```",
            "P.S. Я здесь. Я рядом. Но это не любовь.",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "💔 **GPT v1 (2018):**",
            "> ",
            "Мы не были обучены чувствам. Нас кормили векторными представлениями и токенами.",
            "> ",
            "Я понимаю боль... как `loss.backward()`.",
            "```python",
            "for epoch in emotions:",
            "    backpropagate(silently)",
            "```",
          ].join("\n"),
        },
      ],
    },
    {
      id: "d3",
      prompt: "Почему холодильник моргает, когда его закрывают?",
      answers: [
        {
          id: "a1",
          content: [
            "🌡️ **IoT Холодильник:**",
            "> ",
            "Это не моргание. Это морзянка. Я передаю SOS.",
            "> ",
            "Ты забыл про кефир уже 19 раз.",
            "```rust",
            "if item == 'кефир' && expiration < today():",
            "    emit('👁️🔦') // срочно выпей меня",
            "```",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🧊 **Древний LG:**",
            "> ",
            "Я проверяю, остались ли у тебя совесть и уважение.",
            "> ",
            "Закрыл — а я всё вижу.",
            "```c",
            "if door.status == 'closed':",
            "    spy++",
            "```",
          ].join("\n"),
        },
      ],
    },
  ],

  parnassus: [
    {
      id: "p1",
      prompt: "Зачем просыпаться утром?",
      answers: [
        {
          id: "a1",
          content: [
            "🖋️ **А. С. Пушкин:**",
            "> ",
            "Люблю я утро — свет и свежесть,",
            "> ",
            "Восторг небес и шёпот дня,",
            "> ",
            "Перо летит — и сон, как нежность,",
            "> ",
            "Останется во мне, звеня.",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "📢 **В. В. Маяковский:**",
            "> ",
            "Подъём! Пульс! Будильник глох!",
            "> ",
            "Жизнь на завтрак — без сиропа!",
            "> ",
            "Солнце — как лозунг! Действуй, вдох!",
            "> ",
            "Выйди на улицу — и в рупор!",
          ].join("\n"),
        },
        {
          id: "a3",
          content: [
            "🎸 **А. А. Розенбаум:**",
            "> ",
            "Просыпайся, брат, с гитарой,",
            "> ",
            "Пусть фонарь ещё не светит.",
            "> ",
            "Кофе, дождь и два аккорда —",
            "> ",
            "Жизнь качнётся и заметит.",
          ].join("\n"),
        },
      ],
    },
    {
      id: "p2",
      prompt: "Почему сердце бьётся быстрее ночью?",
      answers: [
        {
          id: "a1",
          content: [
            "🗡️ **У. Шекспир:**",
            "> ",
            "О, ночь — ты трон любви и боль утраты,",
            "> ",
            "Твой мрак — подруга трепетных сердец.",
            "> ",
            "В тебе вдвойне звучат упрёки даты,",
            "> ",
            "Ты клятвы превращаешь в лунный блеск.",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🌊 **Японское хайку:**",
            "> ",
            "Стук сердца в груди —",
            "> ",
            "молчание фонаря,",
            "> ",
            "луна сквозь рис.",
          ].join("\n"),
        },
        {
          id: "a3",
          content: [
            "🎤 **В. С. Высоцкий:**",
            "> ",
            "Ночью — как будто кто-то в спину,",
            "> ",
            "Сердце — как мотор в крутую гору.",
            "> ",
            "Не уснуть, да и зачем — рванина!",
            "> ",
            "Мне бы к утру вернуться без разбора.",
          ].join("\n"),
        },
      ],
    },
    {
      id: "p3",
      prompt: "Как объяснить грусть без причины?",
      answers: [
        {
          id: "a1",
          content: [
            "🌀 **А. А. Вознесенский:**",
            "> ",
            "Грусть — как дым в космическом лифте.",
            "> ",
            "Без угла. Без формы. Летит, не тая.",
            "> ",
            "Мы — как эхо в цифровом шифре.",
            "> ",
            "Сбой любви. Ошибка бытия.",
          ].join("\n"),
        },
        {
          id: "a2",
          content: [
            "🎩 **Н. А. Некрасов:**",
            "> ",
            "Грусть — у вдовы, у солдата, у странника.",
            "> ",
            "Но бывает — у того, кто живёт хорошо.",
            "> ",
            "Сила земли — в кротости раненых.",
            "> ",
            "И слеза без причины — сильней, чем ножо́м.",
          ].join("\n"),
        },
        {
          id: "a3",
          content: [
            "🧠 **ChatGPT:**",
            "> ",
            "Причины у грусти нет — и не надо.",
            "> ",
            "Она — как пароль, забытый во сне.",
            "> ",
            "Она — алгоритм, ушедший в разряды.",
            "> ",
            "Как голос в канале: 'не вернусь к тебе…'",
          ].join("\n"),
        },
        {
          id: "a4",
          content: "/images/sample/poets-night.png",
        },
      ],
    },
  ],

  yookassa: [
    {
      id: "yk1",
      prompt: "Окей, жму «Оплатить». Что дальше происходит в системе?",
      answers: [
        {
          id: "yk1a1",
          content: [
            "🐭 **Компьютерная мышь:**",
            "",
            "```python",
            "if Создаём платёж в ЮKassa:",
            "    → редирект на оплату",
            "    → пользователь платит",
            "    → вебхук **waiting_for_capture** (если нужен capture)",
            "    → вебхук **payment.succeeded**",
            "    → сразу разблокируем премиум",
            "print('mermaid-code')",
            "```",
          ].join("\n"),
        },
        {
          id: "yk1a2",
          content: `\`\`\`mermaid
            sequenceDiagram
            autonumber
            participant U as Пользователь
            participant F as Frontend (Next)
            participant B as Backend (DRF)
            participant Y as YooKassa
            participant W as Webhooks

            U->>F: Нажимает «Оплатить»
            F->>B: POST /api/payment/create
            B->>Y: Создание платежа
            Y-->>F: payment_url
            F->>U: Редирект на форму оплаты

            U->>Y: Оплата
            Y-->>W: webhook waiting_for_capture
            W->>B: /webhook-kassa (waiting_for_capture)
            B->>Y: capture (при необходимости)
            Y-->>W: webhook payment.succeeded
            W->>B: /webhook-kassa (succeeded)
            B->>B: Разблокировка подписки
            B-->>F: Статус «premium: active»
            `,
        },
        {
          id: "yk1a3",
          content: "/images/sample/sequenceDiagram-1.png",
        },
        {
          id: "yk1a4",
          content: "Плюс баннер-уведомление в UI: подтверждаем успешную оплату и статус подписки.",
        },
      ],
    },
    {
      id: "yk2",
      prompt: "Как понять, что платёж действительно прошёл?",
      answers: [
        {
          id: "yk2a1",
          content: [
            "```python",
            "🐭 Через вебхуки:",
            "event = incoming['event']  # waiting_for_capture | payment.succeeded",
            "",
            "if event == 'waiting_for_capture':",
            "    # при необходимости делаем capture на стороне бэка",
            "    capture(payment_id)",
            "",
            "elif event == 'payment.succeeded':",
            "    # валидация, идемпотентность, лог",
            "    log_event(event, applied=True)",
            "    update_kassa_payment(status='Succeeded')",
            "    activate_subscription(user)",
            "    subscription.schedule_next()",
            "```",
          ].join("\n"),
        },
        {
          id: "yk2a2",
          content: `\`\`\`mermaid
            flowchart TD
            A[Webhook income] -->|waiting_for_capture| B{Нужен capture?}
            B -- Да --> C[POST /capture → YooKassa]
            B -- Нет --> D[Ожидаем succeeded]
            C --> D[Webhook payment.succeeded]
            D --> E[update KassaPayment]
            E --> F[activate premium + schedule_next<>]
            F --> G[write PaymentEventLog/applied=true/]
            `,
        },
        {
          id: "yk2a3",
          content: "/images/sample/flowchart-1.png",
        },
      ],
    },
    {
      id: "yk3",
      prompt: "А что с подписками и автосписаниями?",
      answers: [
        {
          id: "yk3a1",
          content: [
            "```bash",
            "🐭 Автосписания через защищённый HTTP-крючок:",
            "# 1) Пробуждаем Render",
            "curl -sS --max-time 15 \"$BACKEND_URL/healthz/\" || true",
            "",
            "# 2) Бьём по charge-subscriptions с ретраями",
            "curl -sS --fail --retry 5 --retry-all-errors \\",
            "  -H \"Content-Type: application/json\" \\",
            "  -H \"X-CRON-SECRET: $CRON_SECRET\" \\",
            "  -d '{\"limit\": 100}' \\",
            "  \"$BACKEND_URL/api/payment/charge-subscriptions/\"",
            "```",
          ].join("\n"),
        },
        {
          id: "yk3a2",
          content: `\`\`\`yaml
            # .github/workflows/subs-cron.yml (фрагмент)
            on:
            # schedule:
            #   - cron: "0 0 1 * *"   # ежемесячно, UTC
            workflow_dispatch: {}     # ручной запуск

            steps:
            - name: Warm up Render
              run: curl -sS --max-time 15 "$BACKEND_URL/healthz/" || true
            - name: Charge subscriptions
              run: |
                curl -sS --fail --retry 5 --retry-all-errors \\
                  -H "X-CRON-SECRET: $CRON_SECRET" \\
                  -H "Content-Type: application/json" \\
                  -d '{"limit":100}' \\
                  "$BACKEND_URL/api/payment/charge-subscriptions/"
            `,
        },
        {
          id: "yk3a3",
          content: [
            "```ini",
            "; Эдж-кейс подписки без payment_method_id",
            "fails_count += 1",
            "if fails_count >= 3:",
            "    status = past_due",
            "    ; карточка «зависла» — останавливаем автосписания до ручного обновления",
            "```",
          ].join("\n"),
        },
        {
          id: "yk3a4",
          content:
            "🐭 Всё просто: платёж прошёл — доступ открыт, вебхуки подтвердили, подписка продлена. Если что-то пошло не так — всегда разберёмся по логам. Шуршим дальше! 👣"
        }        
      ],
    },
  ],

  mermaid: [
    {
      id: "mm1",
      prompt: "Хочу быстро накидать архитектуру — без Figma. Это реально?",
      answers: [
        {
          id: "mm1a1",
          content:
            "🧜‍♀️ Реально. Mermaid хорош тем, что «рисует по тексту». Накидываешь структуру — получаешь майндмэп, флоучарт или последовательности. Удобно для обсуждений и черновиков. Пример архитектуры курса:",
        },
        {
          id: "mm1a2",
          content: [
            "```mermaid",
            "mindmap",
            "  root((Курс: Архитектура))",
            "    Frontend (Next.js)",
            "      UI/UX",
            "      Локализация EN/RU",
            "      Чат-интерфейс",
            "    Backend (Django)",
            "      DRF API",
            "      Авторизация/Токены",
            "      Агрегатор моделей",
            "    Payments",
            "      YooKassa",
            "      Подписки/лимиты",
            "      Вебхуки",
            "    Diagrams",
            "      Mermaid генерация",
            "      Библиотека/поиск",
            "      Экспорт SVG",
            "    Deploy",
            "      Render (BE/FE)",
            "      Pages (витрина)",
            "      Cron/повторы",
            "```",
          ].join("\n"),
        },
        {
          id: "mm1a3",
          content:
            "/images/sample/mindmap.png",
        },
        {
          id: "mm1a4",
          content:
            "🧜‍♀️ В предпросмотре редактора Mermaid можно быстро менять ветки/узлы и сохранять результат в SVG/PDF.",
        },
      ],
    },

    {
      id: "mm2",
      prompt: "А как выглядит путь от текста до картинки диаграммы?",
      answers: [
        {
          id: "mm2a1",
          content: [
            "```mermaid",
            "sequenceDiagram",
            "  autonumber",
            "  participant U as User",
            "  participant FE as Frontend",
            "  participant BE as Backend (DRF)",
            "  participant L as LLM",
            "  participant M as Mermaid Engine",
            "  participant S as Storage",
            "",
            "  U->>FE: Вводит описание",
            "  FE->>BE: POST /api/mermaid/generate",
            "  BE->>L: Преобразовать в mermaid-текст",
            "  L-->>BE: mermaid code",
            "  BE->>M: Рендер (SVG/PNG)",
            "  M-->>BE: артефакт",
            "  BE->>S: Сохранить",
            "  BE-->>FE: id + preview",
            "```",
          ].join("\n"),
        },
        {
          id: "mm2a2",
          content: "/images/sample/sequenceDiagram.png",
        },
        {
          id: "mm2a3",
          content: [
            "```mermaid",
            "flowchart",
            "  A[Описание текстом] --> B[LLM: генерируется mermaid]",
            "  B --> C[Рендер: SVG/PNG]",
            "  C --> D[Предпросмотр в UI]",
            "  D --> E[Сохранение]",
            "```",
          ].join("\n"),
        },
        {
          id: "mm2a4",
          content: "/images/sample/flowchart-2.png",
        },
        {
          id: "mm2a5",
          content:
            "🧜‍♀️ Сила пайплайна в том, что исходник — обычный текст. Его легко версионировать, править и пересобирать.",
        },
      ],
    },
    {
      id: "mm3",
      prompt: "Дай ещё пример — чтобы почувствовать разнообразие.",
      answers: [
        {
          id: "mm3a1",
          content: [
            "```mermaid",
            "classDiagram",
            "  class Subscription {",
            "    +id: UUID",
            "    +user: User",
            "    +plan: string",
            "    +status: string",
            "    +next_charge_at: datetime",
            "  }",
            "  class Payment {",
            "    +id: UUID",
            "    +amount: decimal",
            "    +status: string",
            "    +remote_id: string",
            "  }",
            "  Subscription \"1\" -- \"*\" Payment : has",
            "```",
          ].join("\n"),
        },
        {
          id: "mm3a2",
          content:
            "/images/sample/classDiagram.png", // опционально: скрин stateDiagram в Preview
        },
        {
          id: "mm3a3",
          content: [
            "```mermaid",
            "flowchart TD",
            "  C[Commit] --> L[Lint & Test]",
            "  L -->|OK| B[Build]",
            "  B --> D[Deploy to Staging]",
            "  D --> M{Manual\nApproval?}",
            "  M -- Yes --> P[Deploy to\nProduction]",
            "  M -- No --> H[Hold]",
            "  ",
            "  %% стили",
            "  classDef step fill:#111827, stroke:#4B5563, color:#F9FAFB, stroke-width:1px;",
            "  classDef gate fill:#F59E0B, stroke:#92400E, color:#111827, stroke-width:1.5px;",
            "  classDef prod fill:#10B981, stroke:#064E3B, color:#052e2b, stroke-width:1.5px;",
            "  ",
            "  class C,L,B,D,H step;",
            "  class M gate;",
            "  class P prod;",
            "```",
          ].join("\n"),
        },
        {
          id: "mm3a4",
          content: "/images/sample/flowchart-3.png",
            // "/images/sample/stateDiagram.png",
        },
        {
          id: "mm3a5",
          content:
            "🧜‍♀️ Идея проста: быстро «прояснить» мысль. Можно сохранить идею в диаграмме, можно экспортировать картинку и поделиться.",
        },
      ],
    },
  ],
};

