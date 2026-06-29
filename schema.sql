-- Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT,
    thank_you_token TEXT UNIQUE NOT NULL
);

-- Create Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 5,
    comment TEXT NOT NULL
);

-- Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Create Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    image_url TEXT NOT NULL
);

-- Seed Default Settings if they don't exist
INSERT INTO public.settings (key, value) VALUES
('admin_password', 'love2026')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('countdown_end', '2026-07-15T00:00:00.000Z')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('gallery_text_above', 'لقطات حية لبعض الذكريات الرائعة المطبوعة والمحفوظة لعملائنا 📸')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('gallery_text_below', 'كل صورة تحكي قصة حب، وذكريات تعيش للأبد في قلوب من تحب.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('website_details', 'موقع رسائل الحب هو طريقتك المبتكرة للتعبير عن مشاعرك. نحن نقوم بتحويل صورك وكلماتك الرومانسية إلى صفحة ويب تفاعلية خاصة بك وبمن تحب، ومحمية بكلمة مرور لا يعرفها أحد غيركما. تبقى هذه الصفحة محفوظة للأبد على الإنترنت لتستعيدا ذكرياتكما معاً في أي وقت ومن أي مكان بالعالم.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('thank_you_message', 'سعداء جداً بكوننا جزءاً من توثيق ذكرياتكما الرومانسية! سيقوم فريقنا بالتواصل معك عبر الواتساب خلال 24 ساعة لبدء تصميم هديتك المميّزة. ❤️')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('thank_you_step1', 'سنقوم بالتواصل معك عبر الواتساب على الرقم المرفق بالطلب خلال 24 ساعة كحد أقصى.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('thank_you_step2', 'سنسلمك رابط صفحتكما الخاصة والرقم السري الخاص بها، لتفاجئ بها شريك حياتك بهدية لا تُنسى!')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('website_price', '80')
ON CONFLICT (key) DO NOTHING;



INSERT INTO public.settings (key, value) VALUES
('pixel_id', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('pixel_access_token', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
('pixel_test_code', '')
ON CONFLICT (key) DO NOTHING;

-- Seed Default Testimonials
INSERT INTO public.testimonials (name, stars, comment) VALUES
('أحمد وندى', 5, 'الفكرة عبقرية جداً! عملت الصفحة دي لخطيبتي في عيد ميلادها وعيطت من الفرحة بجد. شكراً ليكم على السرعة والذوق.'),
('سارة م.', 5, 'حبيت جداً الخصوصية التامة وأننا بنحمي صفحتنا برقم سري خاص بينا بس. الجودة ممتازة والخدمة رائعة للغاية.'),
('محمود العشري', 5, 'هدية مبتكرة وجديدة خالص برة الصندوق. أحسن بكتير من الهدايا التقليدية المعتادة.')
ON CONFLICT DO NOTHING;

-- Seed Default FAQs
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('كيف تعمل الخدمة؟', 'بعد طلب الخدمة، سنقوم بالتواصل معك عبر الواتساب لتسلم الصور والرسائل التي تود إضافتها. سنقوم بتصميم صفحة ويب خاصة ورومانسية جداً باسمك واسم شريكك، محمية بكلمة مرور خاصة بكما فقط.', 1),
('هل يمكنني تعديل المحتوى لاحقاً؟', 'نعم، يمكنك طلب تعديل الصور أو الرسائل في أي وقت من خلال التواصل مع الدعم الفني الخاص بنا وسنقوم بتحديثها فوراً.', 2),
('هل الصفحة آمنة وخاصة؟', 'بكل تأكيد. الصفحة تكون محمية بكلمة مرور مخصصة لا يتم مشاركتها مع أي شخص آخر، ولا يمكن لأحد رؤية ذكرياتكم سواكم.', 3),
('كم من الوقت تستغرق الصفحة لتصبح جاهزة؟', 'يستغرق العمل من 12 إلى 24 ساعة كحد أقصى بعد استلام الصور والرسائل منك.', 4)
ON CONFLICT DO NOTHING;
