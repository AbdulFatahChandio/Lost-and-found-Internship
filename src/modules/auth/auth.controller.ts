import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/sign-up.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth') // Group in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and returned with JWT token',
  })
  @ApiResponse({ status: 400, description: 'Email already exists or invalid input' })
  @ApiBody({ type: SignupDto })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and JWT token returned',
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiBody({ type: LoginDto })
  signin(@Body() dto: LoginDto) {
    return this.authService.signin(dto);
  }
}
