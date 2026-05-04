import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/pages/login_register/forgot_password_page.dart';
import 'package:myapp/services/bloc/auth_bloc.dart';
import 'package:myapp/pages/login_register/register_screen.dart';
import 'package:myapp/pages/login_register/widgets/modern_input.dart';
import 'package:myapp/pages/login_register/widgets/social_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    const Color brandColor = Color(0xFF2D79FF); 
    const Color secondaryColor = Color(0xFF00D2FF); 
    const Color bgColor = Color(0xFFF8FAFF); 
    const Color textColor = Color(0xFF1A1C1E);

    return Scaffold(
      backgroundColor: bgColor,
      body: Stack(
        children: [
          Container(
            height: MediaQuery.of(context).size.height * 0.4,
            width: double.infinity,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [brandColor, secondaryColor],
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.local_hospital_rounded, color: Colors.white, size: 40),
                    const SizedBox(height: 20),
                    Text(
                      'HealthLine',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                        color: Colors.white.withOpacity(0.9),
                        letterSpacing: 1,
                      ),
                    ),
                    const Text(
                      'Chăm sóc sức khỏe 4.0',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ),

          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: MediaQuery.of(context).size.height * 0.7,
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(40),
                  topRight: Radius.circular(40),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x1A000000), 
                    blurRadius: 30,
                    offset: Offset(0, -10),
                  )
                ],
              ),
              child: BlocConsumer<AuthBloc, AuthState>(
                listener: (context, state) {
                  if (state is AuthSuccess) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Xin chào, ${state.user.fullName}!')),
                    );
                    Navigator.pushReplacementNamed(context, '/main');
                  } else if (state is AuthFailure) {
                    print(state.message);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(state.message),
                        backgroundColor: Colors.redAccent,
                      ),
                    );
                  }
                },
                builder: (context, state) {
                  return SingleChildScrollView(
                    padding: const EdgeInsets.all(35),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Chào mừng trở lại!',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text('Vui lòng đăng nhập để tiếp tục', 
                          style: TextStyle(color: Colors.grey, fontSize: 15)),
                        
                        const SizedBox(height: 40),

                        ModernInput(
                          controller: _emailController,
                          hint: 'Email của bạn',
                          label: 'Email',
                          icon: Icons.alternate_email_rounded,
                          primaryColor: brandColor,
                        ),
                        
                        const SizedBox(height: 25),

                        ModernInput(
                          controller: _passwordController,
                          hint: '••••••••',
                          label: 'Mật khẩu',
                          icon: Icons.lock_open_rounded,
                          primaryColor: brandColor,
                          isPassword: true,
                        ),

                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (context) => ForgotPasswordPage()),
                              );
                            },
                            child: const Text('Quên mật khẩu?', 
                              style: TextStyle(color: brandColor, fontWeight: FontWeight.w600)),
                          ),
                        ),

                        const SizedBox(height: 30),

                        Container(
                          width: double.infinity,
                          height: 60,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(18),
                            boxShadow: [
                              BoxShadow(
                                color: brandColor.withOpacity(0.3),
                                blurRadius: 15,
                                offset: const Offset(0, 8),
                              )
                            ],
                          ),
                          child: ElevatedButton(
                            onPressed: state is AuthLoading 
                                ? null 
                                : () {
                                    context.read<AuthBloc>().add(
                                      LoginRequested(
                                        email: _emailController.text,
                                        password: _passwordController.text,
                                      )
                                    );
                                  },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: brandColor,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18),
                              ),
                              elevation: 0, 
                            ),
                            child: state is AuthLoading 
                                ? const CircularProgressIndicator(color: Colors.white) 
                                : const Text(
                                    'Đăng Nhập',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                                  ),
                          ),
                        ),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            const Text('Bạn chưa có tài khoản?', style: TextStyle(color: Colors.grey)),
                            TextButton(
                              onPressed: (){
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (context) => const RegisterScreen()),
                                );
                              }, 
                              child: Text(
                                "Đăng kí",
                                style: TextStyle(color: brandColor, fontWeight: FontWeight.w600),
                              )
                            )
                          ],
                        ),

                        const SizedBox(height: 20),

                        const Center(child: Text('Hoặc đăng nhập bằng', style: TextStyle(color: Colors.grey))),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SocialButton(icon:Icons.facebook, color: Colors.blue),
                            const SizedBox(width: 20),
                            SocialButton(icon: Icons.g_mobiledata, color: Colors.red),
                          ],
                        )
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}