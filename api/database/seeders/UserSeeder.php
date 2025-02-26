<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        $users = [
            [
                'first_name' => 'Admin',
                'last_name' => 'Dev',
                'email' => 'admin@dev.com',
                'password' => bcrypt('Password@123'),
                'role' => 'Admin',
            ],
            [
                'first_name' => 'User',
                'last_name' => 'Dev',
                'email' => 'user@dev.com',
                'password' => bcrypt('Password@123'),
                'role' => 'User',
            ],
        ];

        foreach ($users as $user) {
            $new_user = User::create([
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'password' => $user['password'],
            ]);
            $new_user->assignRole($user['role']);
        }
    }
}
