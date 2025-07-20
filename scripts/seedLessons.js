import { createClient } from '@supabase/supabase-js';
import { sampleLessons } from '../src/lib/contentManager.js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function seedLessons() {
  try {
    console.log('🔍 Checking if lessons table is empty...');

    const { data: existingLessons, error: fetchError } = await supabase
      .from('lessons')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching existing lessons:', fetchError.message);
      return;
    }

    if (existingLessons.length > 0) {
      console.log(`⚠️ Lessons table already has ${existingLessons.length} entries. Skipping seeding to prevent duplicates.`);
      return;
    }

    console.log('✅ Lessons table is empty. Proceeding with seeding...');

    for (const category in sampleLessons) {
      const lessonsInCategory = sampleLessons[category];
      for (const lesson of lessonsInCategory) {
        const { error } = await supabase
          .from('lessons')
          .insert({
            title: lesson.title,
            content: lesson.content,
            category: lesson.category,
            order_index: lesson.order_index,
          });

        if (error) {
          console.error(`❌ Error inserting lesson "${lesson.title}":`, error.message);
        } else {
          console.log(`✅ Inserted lesson: "${lesson.title}"`);
        }
      }
    }

    console.log('🎉 Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error.message);
  }
}

seedLessons();
