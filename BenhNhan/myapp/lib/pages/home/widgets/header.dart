import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/auth/auth_bloc.dart'; 

class Header extends StatelessWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 50, 20, 30),
      decoration: const BoxDecoration(
        color: Color(0xFF00B4D8),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          String displayName = "Bạn";
          String? avatarUrl;

          if (state is AuthSuccess) {
            displayName = state.user.fullName; 
          }

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Icon(Icons.notes, color: Colors.white),
                  CircleAvatar(
                    backgroundColor: Colors.white,
                    radius: 20,
                    backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl) : null,
                    child: avatarUrl == null
                        ? const Icon(Icons.person, color: Color(0xFF00B4D8)) 
                        : null,
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                "Xin chào, $displayName!", 
                style: const TextStyle(
                  color: Colors.white, 
                  fontSize: 22, 
                  fontWeight: FontWeight.bold
                ),
              ),
              const Text(
                "Hôm nay bạn thấy thế nào?",
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 15),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(15),
                ),
                child: GestureDetector(
                  onTap: () => Navigator.pushNamed(context, '/search'),
                  child: const TextField(
                    decoration: InputDecoration(
                      hintText: "Tìm kiếm bác sĩ",
                      border: InputBorder.none,
                      suffixIcon: Icon(Icons.search, color: Color(0xFF00B4D8)),
                    ),
                    enabled: false,
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}