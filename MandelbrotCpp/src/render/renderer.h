#include "../common/CImg.h"
#include "../common/color.h"
#include "../common/fractal.h"
using namespace cimg_library;

const unsigned int GREY_SCALE = 0;
const unsigned int RAINBOW = 1;
const unsigned int DYNAMIC_ITR = 0;

class Renderer
{
private:
    CImg<float> image;
    bool dynamicItr = false;

    void init();
    void renderThread(int pid, int THREAD_COUNT);
    void setPixel(int x, int y, Color color);
    Color getColor(int itr);
    
public:
    unsigned int width;
    unsigned int height;
    double reCenter;
    double imCenter;
    float zoom;
    unsigned int maxItr;
    unsigned int colorFunc;

    Renderer(int w, int h, double re, double im, float z, int itr, int color);
    ComplexPoint convertToPoint(int x, int y);
    CImg<float> render();
};
