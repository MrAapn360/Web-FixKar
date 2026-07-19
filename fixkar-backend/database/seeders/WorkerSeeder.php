<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\User;
use App\Models\WorkerProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds demo workers with the same data as the frontend's mock API
 * (src/api/mockData.js) so the app looks identical whether it's running
 * against the mock layer or the real Laravel backend.
 */
class WorkerSeeder extends Seeder
{
    public function run(): void
    {
        $workers = [
            [
                'full_name' => 'Imran Ali',
                'email' => 'worker@fixkar.test', // matches frontend mock demo login
                'city' => 'Karachi',
                'phone' => '03007654321',
                'category' => 'Electrician',
                'bio' => 'Certified electrician with 8 years of experience in residential and commercial wiring.',
                'skills' => ['Wiring', 'Fan installation', 'Circuit repair', 'UPS setup'],
                'experience_years' => 8,
                'hourly_rate' => 800,
                'service_area' => 'Gulshan-e-Iqbal',
                'is_available' => true,
                'is_verified' => true,
                'average_rating' => 4.7,
                'total_jobs_done' => 120,
                'reviews' => [
                    ['customer_name' => 'Ahmed S.', 'rating' => 5, 'comment' => 'Very professional, fixed the wiring quickly.', 'tags' => ['On time', 'Professional']],
                    ['customer_name' => 'Sana K.', 'rating' => 4, 'comment' => 'Good work, slightly late but polite.', 'tags' => ['Skilled']],
                ],
            ],
            [
                'full_name' => 'Bilal Ahmed',
                'email' => 'bilal.ahmed@fixkar.test',
                'city' => 'Karachi',
                'phone' => '03001112222',
                'category' => 'Plumber',
                'bio' => 'Expert plumber for leakages, water tanks, and bathroom fittings.',
                'skills' => ['Leak repair', 'Pipe fitting', 'Tank cleaning', 'Geyser install'],
                'experience_years' => 6,
                'hourly_rate' => 700,
                'service_area' => 'North Nazimabad',
                'is_available' => true,
                'is_verified' => true,
                'average_rating' => 4.5,
                'total_jobs_done' => 85,
                'reviews' => [
                    ['customer_name' => 'Usman R.', 'rating' => 5, 'comment' => 'Fixed a bad leak, fair price.', 'tags' => ['Fair price', 'On time']],
                ],
            ],
            [
                'full_name' => 'Saeed Khan',
                'email' => 'saeed.khan@fixkar.test',
                'city' => 'Lahore',
                'phone' => '03002223333',
                'category' => 'Carpenter',
                'bio' => 'Custom furniture, door repair, and woodwork specialist.',
                'skills' => ['Furniture', 'Door repair', 'Polishing', 'Cabinets'],
                'experience_years' => 10,
                'hourly_rate' => 900,
                'service_area' => 'Johar Town',
                'is_available' => false,
                'is_verified' => true,
                'average_rating' => 4.8,
                'total_jobs_done' => 160,
                'reviews' => [],
            ],
            [
                'full_name' => 'Naveed Iqbal',
                'email' => 'naveed.iqbal@fixkar.test',
                'city' => 'Karachi',
                'phone' => '03003334444',
                'category' => 'AC Technician',
                'bio' => 'AC installation, gas refilling, and servicing for all brands.',
                'skills' => ['AC service', 'Gas refill', 'Installation', 'Cooling repair'],
                'experience_years' => 5,
                'hourly_rate' => 1000,
                'service_area' => 'DHA Phase 5',
                'is_available' => true,
                'is_verified' => false,
                'average_rating' => 4.3,
                'total_jobs_done' => 40,
                'reviews' => [],
            ],
            [
                'full_name' => 'Asif Raza',
                'email' => 'asif.raza@fixkar.test',
                'city' => 'Islamabad',
                'phone' => '03004445555',
                'category' => 'Mechanic',
                'bio' => 'Home car service, battery, and engine diagnostics.',
                'skills' => ['Engine', 'Battery', 'Oil change', 'Diagnostics'],
                'experience_years' => 7,
                'hourly_rate' => 1200,
                'service_area' => 'F-11',
                'is_available' => true,
                'is_verified' => true,
                'average_rating' => 4.6,
                'total_jobs_done' => 95,
                'reviews' => [],
            ],
            [
                'full_name' => 'Kamran Shah',
                'email' => 'kamran.shah@fixkar.test',
                'city' => 'Karachi',
                'phone' => '03005556666',
                'category' => 'Painter',
                'bio' => 'Interior and exterior painting with clean, on-time work.',
                'skills' => ['Wall paint', 'Texture', 'Waterproofing', 'Ceiling'],
                'experience_years' => 9,
                'hourly_rate' => 600,
                'service_area' => 'Malir',
                'is_available' => true,
                'is_verified' => true,
                'average_rating' => 4.4,
                'total_jobs_done' => 70,
                'reviews' => [],
            ],
            [
                'full_name' => 'Rashid Mehmood',
                'email' => 'rashid.mehmood@fixkar.test',
                'city' => 'Rawalpindi',
                'phone' => '03006667777',
                'category' => 'Laborer',
                'bio' => 'General labor, shifting, and loading work. Reliable and punctual.',
                'skills' => ['Shifting', 'Loading', 'Cleaning', 'Digging'],
                'experience_years' => 4,
                'hourly_rate' => 500,
                'service_area' => 'Saddar',
                'is_available' => true,
                'is_verified' => false,
                'average_rating' => 4.1,
                'total_jobs_done' => 30,
                'reviews' => [],
            ],
            [
                'full_name' => 'Faisal Nadeem',
                'email' => 'faisal.nadeem@fixkar.test',
                'city' => 'Lahore',
                'phone' => '03007778888',
                'category' => 'Electrician',
                'bio' => 'Quick response electrician for emergencies and installations.',
                'skills' => ['Emergency repair', 'Wiring', 'MCB', 'Lighting'],
                'experience_years' => 6,
                'hourly_rate' => 750,
                'service_area' => 'Model Town',
                'is_available' => true,
                'is_verified' => true,
                'average_rating' => 4.5,
                'total_jobs_done' => 88,
                'reviews' => [],
            ],
        ];

        // Demo customer account (matches frontend mock login: customer@fixkar.test / password)
        $demoCustomer = User::firstOrCreate(
            ['email' => 'customer@fixkar.test'],
            [
                'full_name' => 'Demo Customer',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'city' => 'Karachi',
                'phone' => '03001234567',
                'email_verified_at' => now(),
            ]
        );

        foreach ($workers as $data) {
            $reviews = $data['reviews'];
            unset($data['reviews']);

            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'full_name' => $data['full_name'],
                    'password' => Hash::make('password'),
                    'role' => 'worker',
                    'city' => $data['city'],
                    'phone' => $data['phone'],
                    'email_verified_at' => now(),
                ]
            );

            $profile = WorkerProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'category' => $data['category'],
                    'bio' => $data['bio'],
                    'skills' => $data['skills'],
                    'experience_years' => $data['experience_years'],
                    'hourly_rate' => $data['hourly_rate'],
                    'service_area' => $data['service_area'],
                    'is_available' => $data['is_available'],
                    'is_verified' => $data['is_verified'],
                    'average_rating' => $data['average_rating'],
                    'total_reviews' => count($reviews),
                    'total_jobs_done' => $data['total_jobs_done'],
                ]
            );

            // Skip if this worker's demo reviews were already seeded (keeps `db:seed` safe to rerun).
            if (empty($reviews) || Review::where('worker_id', $user->id)->exists()) {
                continue;
            }

            foreach ($reviews as $r) {
                // Reviews need a completed booking to attach to (booking_id is unique/required).
                $booking = \App\Models\Booking::create([
                    'customer_id' => $demoCustomer->id,
                    'worker_id' => $user->id,
                    'category' => $data['category'],
                    'description' => 'Seed demo booking for review.',
                    'city' => $data['city'],
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);

                Review::create([
                    'booking_id' => $booking->id,
                    'customer_id' => $demoCustomer->id,
                    'worker_id' => $user->id,
                    'rating' => $r['rating'],
                    'comment' => $r['comment'],
                    'tags' => $r['tags'],
                ]);
            }

            unset($profile);
        }
    }
}
