<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Seed the initial Super Admin account.
     */
    public function run(): void
    {
        $email = env('SUPER_ADMIN_EMAIL', 'abdallahdiouf.dev@gmail.com');
        $password = env('SUPER_ADMIN_PASSWORD', 'Khoudia1970');
        $name = env('SUPER_ADMIN_NAME', 'Super Administrateur');
        $phone = env('SUPER_ADMIN_PHONE', '771234567');

        $admin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'phone' => $phone,
                'password' => $password, // automatically hashed by User casts
                'role' => 'admin',
                'active' => true,
                'is_subscribed' => true,
            ]
        );

        $admin->syncRoles(['admin']);

        $this->command?->info("Super Admin seeded: {$email}");
    }
}
