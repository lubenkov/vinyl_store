import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/user.service';
import { UpdateProfileDto } from '../../src/users/dto/update-profile.dto';

describe('UserController (integration)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let adminToken: string;
    let userToken: string;
    let userService: UsersService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(UsersService)
            .useValue({
                getProfile: jest.fn().mockResolvedValue({
                    firstName: 'Test',
                    lastName: 'Test',
                    email: 'test@gmail.com',
                    birthdate: 'test-birthdate',
                    avatar: 'test-image-url',
                }),
                updateProfile: jest.fn().mockResolvedValue({
                    firstName: 'Updated Test',
                    lastName: 'Updated Test',
                    birthdate: 'updated-birthdate',
                    avatar: 'updated-image-url',
                }),
                deleteProfile: jest.fn().mockResolvedValue(undefined),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = moduleFixture.get<JwtService>(JwtService);
        adminToken = jwtService.sign({ userId: 1 });
        userToken = jwtService.sign({ userId: 2 });
        userService = moduleFixture.get<UsersService>(UsersService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /users/profile - should return user profile', async () => {
        const response = await request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('email', 'test@gmail.com');
        expect(response.body.firstName).toBe('Test');
    });

    it('PUT /users/profile - should update user profile', async () => {
        const updateProfileDto: UpdateProfileDto = {
            firstName: 'Updated Test',
            lastName: 'Updated Test',
            birthdate: 'updated-birthdate',
            avatar: 'updated-image-url',
        };
        const response = await request(app.getHttpServer())
            .put('/users/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .send(updateProfileDto)
            .expect(200);

        expect(response.body).toMatchObject(updateProfileDto);
    });

    it('DELETE /users/profile - should delete user profile', async () => {
        await request(app.getHttpServer())
            .delete('/users/profile')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
    });
});
