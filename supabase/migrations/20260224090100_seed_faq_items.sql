insert into public.faq_items (item_order, question, answer, is_active)
values
  (
    1,
    'How soon will I receive booking confirmation?',
    'Most bookings are confirmed within minutes. Some partner activities may need manual confirmation within 24 hours.',
    true
  ),
  (
    2,
    'Can I change my travel dates after booking?',
    'Date changes depend on supplier policy. If your booking is flexible, we can help process date updates subject to availability.',
    true
  ),
  (
    3,
    'What happens if weather affects my tour?',
    'If an activity is cancelled due to weather, we will help arrange a rebooking or refund based on the operator terms.',
    true
  ),
  (
    4,
    'How do I request an official receipt?',
    'Send your booking reference to support and our team will provide an official receipt using the billing details on file.',
    true
  )
on conflict (item_order) do update
set
  question = excluded.question,
  answer = excluded.answer,
  is_active = excluded.is_active,
  updated_at = now();
