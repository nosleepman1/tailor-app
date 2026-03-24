<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            ['name' => 'General', 'type' => 'general', 'is_recurring' => true],
            ['name' => 'Korite', 'type' => 'korite', 'is_recurring' => true],
            ['name' => 'Tabaski', 'type' => 'tabaski', 'is_recurring' => true],
            ['name' => 'Gammu', 'type' => 'gammu', 'is_recurring' => true],
            ['name' => 'Magal', 'type' => 'magal', 'is_recurring' => true],
        ];

        foreach ($events as $event) {
            \App\Models\Event::updateOrCreate(['type' => $event['type']], $event);
        }
    }
}
