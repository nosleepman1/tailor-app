<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles for web and api guards
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $tailorRole = Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'web']);

        $adminApi = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $tailorApi = Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'api']);
    }
}
