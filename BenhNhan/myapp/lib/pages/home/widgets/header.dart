import 'package:flutter/material.dart';

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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(Icons.notes, color: Colors.white),
              CircleAvatar(backgroundColor: Colors.white, radius: 20),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            "Chào buổi sáng, Vanh!",
            style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
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
      ),
    );
  }
}