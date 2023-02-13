cmake_minimum_required(VERSION 3.5)
project(Mandelbrot)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(
    Mandelbrot
    src/main.cpp
    src/render/renderer.cpp
    src/common/complexpoint.cpp
    src/common/fractal.cpp
)

find_package(Threads REQUIRED)
find_package(X11 REQUIRED)
include_directories(${X11_INCLUDE_DIR})
target_link_libraries(Mandelbrot ${CMAKE_THREAD_LIBS_INIT} ${X11_LIBRARIES})