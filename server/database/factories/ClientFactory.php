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
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'phone' => fake()->numerify('+221 77 ### ## ##'),
            'price' => fake()->numberBetween(10000.00, 150000.00),
            'taille' => fake()->numberBetween(150, 200),
            'poitrine' => fake()->numberBetween(80, 120),
            'epaule' => fake()->numberBetween(40, 60),
            'hanche' => fake()->numberBetween(80, 120),
            'cou' => fake()->numberBetween(30, 50),
            'pantalon' => fake()->numberBetween(70, 110),
            'fesse' => fake()->numberBetween(80, 120),
            'cuisse' => fake()->numberBetween(40, 60),
            'biceps' => fake()->numberBetween(30, 50),
            'bras' => fake()->numberBetween(30, 50),
        ];
    }
}
