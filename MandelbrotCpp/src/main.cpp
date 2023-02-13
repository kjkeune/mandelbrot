#include "main.h"
#include <chrono>
#include <ctime>
#include <iostream>

using namespace std;
using namespace cimg_library;

int main()
{
    // Nutzer Parameter
    unsigned int width = 1000;
    unsigned int height = 1000;
    double reCenter = 0.0;
    double imCenter = 0.0;
    float zoom = 0.0f;
    int maxItr = DYNAMIC_ITR;
    int colorFunc = RAINBOW;
    // Initialisierung
    CImgDisplay display(width, height, "Mandelbrot Viewer", 0);
    Renderer *renderer = new Renderer(width, height, reCenter, imCenter, zoom, maxItr, colorFunc);
    // Display Events
    render(renderer, &display);
    while (!display.is_closed())
    {
        int x = display.mouse_x();
        int y = display.mouse_y();
        ComplexPoint point = renderer->convertToPoint(x, y);
        if (display.button() & 1)
        {
            renderer->reCenter = point.re;
            renderer->imCenter = point.im;
            render(renderer, &display);
        }
        else if (display.wheel() > 0)
        {
            renderer->reCenter = point.re;
            renderer->imCenter = point.im;
            renderer->zoom++;
            render(renderer, &display);
        }
        else if (display.wheel() < 0)
        {
            renderer->reCenter = point.re;
            renderer->imCenter = point.im;
            renderer->zoom--;
            render(renderer, &display);
        }
        display.set_wheel();
        display.wait();
    }
}

void render(Renderer *renderer, CImgDisplay *display)
{
    cout << "Rendering: "
         << "(Re:" << renderer->reCenter << ", Im:" << renderer->imCenter << ", Zoom:" << renderer->zoom << "x , maxItr:" << renderer->maxItr << ") ..." << endl;
    auto start = chrono::system_clock::now();
    display->display(renderer->render());
    auto end = chrono::system_clock::now();
    chrono::duration<double> time = end - start;
    cout << "... Finished in: " << time.count() << "s" << endl
         << endl;
}