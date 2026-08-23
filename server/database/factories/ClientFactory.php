<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tailor_id' => \App\Models\User::factory(),
            'full_name' => fake()->name(),
            'phone' => fake()->numerify('+221 77 ### ## ##'),
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'measurements' => json_encode([
                'epaule' => fake()->numberBetween(40, 60),
                'poitrine' => fake()->numberBetween(80, 120),
                'taille' => fake()->numberBetween(150, 200),
                'hanche' => fake()->numberBetween(80, 120),
                'cou' => fake()->numberBetween(30, 50),
                'pantalon' => fake()->numberBetween(70, 110),
                'fesse' => fake()->numberBetween(80, 120),
                'cuisse' => fake()->numberBetween(40, 60),
                'biceps' => fake()->numberBetween(30, 50),
                'bras' => fake()->numberBetween(30, 50),
            ]),
            'notes' => fake()->text(),
        ];
    }
}
